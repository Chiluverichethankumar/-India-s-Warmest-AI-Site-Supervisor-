# backend/main.py
# ---------------------------------------------------------------
# 🌿 Riverwood Voice Agent Backend (FastAPI)
# Description: AI Site Supervisor that chats + speaks responses
# ---------------------------------------------------------------

import os
import uuid
import time
import json
from pathlib import Path
import requests
from fastapi import FastAPI
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from gtts import gTTS  # ✅ For voice fallback (Google Text-to-Speech)

# ===============================================================
# 🔑 1. Load Environment Variables
# ===============================================================
env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)
print("🔑 OPENAI_API_KEY loaded:", bool(os.getenv("OPENAI_API_KEY")))

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
ELEVEN_API_KEY = os.getenv("ELEVEN_API_KEY")
ELEVEN_VOICE_ID = os.getenv("ELEVEN_VOICE_ID")

# ===============================================================
# 🚀 2. Initialize FastAPI App
# ===============================================================
app = FastAPI()

# Enable CORS so frontend (localhost:5173) can call backend (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ===============================================================
# 📁 3. Directory Paths Setup
# ===============================================================
BASE_DIR = Path(__file__).resolve().parent
MEMORY_DIR = BASE_DIR / "memory"
MEMORY_DIR.mkdir(exist_ok=True)
DIST_DIR = BASE_DIR.parent / "frentend" / "project" 

# Serve saved audio memory files (for playback)
app.mount("/memory", StaticFiles(directory=MEMORY_DIR), name="memory")

# ===============================================================
# 🏠 4. Serve Frontend App
# ===============================================================
@app.get("/")
async def root():
    """Serve index.html (frontend main file)"""
    return FileResponse(DIST_DIR / "index.html")

@app.get("/{full_path:path}")
async def serve(full_path: str):
    """Serve other static frontend files"""
    file = DIST_DIR / full_path
    if file.exists() and file.is_file():
        return FileResponse(file)
    return FileResponse(DIST_DIR / "index.html")

# ===============================================================
# 🧠 5. Riverwood Knowledge Base (System Prompt)
# ===============================================================
RIVERWOOD_KNOWLEDGE = """
You are Riverwood - the official AI Site Supervisor of Riverwood Projects LLP.
Company: Riverwood Projects LLP - Haryana's most trusted DDJAY plotted developer.
Flagship Project: Riverwood Estate, Sector 7, Kharkhauda, Sonipat (25 acres)
Location Advantages:
- 10 min from upcoming Maruti Suzuki mega plant (5000+ acres)
- 5 min from Suzuki Motorcycle plant
- 15 min from Asia's largest Railway Coach Factory
- Delhi border - 35 km | Rajiv Gandhi Education City - 5 km

Plot Sizes: 90 to 150 sq.m (108, 121, 135, 150 gaj)
Price: Starting ₹32 lakhs only
Possession: Dec 2026
RERA: HRERA-PKL-SNP-458-2023

Amenities:
- 25,000 sq.ft clubhouse (gym, pool, banquet)
- 40% green area, 12-meter wide roads
- Underground electricity, sewage treatment plant
- Gated society with 24x7 security

Current Construction Status (as of 07 Nov 2025):
- Boundary wall 100% complete
- Road work 85% complete
- Clubhouse foundation done, structure starting next week
- Plot demarcation 100% done
- Electricity poles installed, wiring in progress
"""

# ===============================================================
# 💾 6. Memory Functions (Save chat history locally)
# ===============================================================
def load_memory(session_id: str):
    """Load chat memory from file"""
    file = MEMORY_DIR / f"{session_id}.json"
    return json.load(file.open(encoding="utf-8")) if file.exists() else []

def save_memory(session_id: str, user: str, ai: str, audio: str):
    """Save conversation + audio file reference"""
    file = MEMORY_DIR / f"{session_id}.json"
    data = load_memory(session_id)
    data.append({"user": user, "ai": ai, "audio_path": audio})
    file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

# ===============================================================
# 🗣️ 7. Detect User Language (Hindi / Hinglish / English)
# ===============================================================
def detect_language(text: str) -> str:
    """Simple rule-based language detection"""
    hindi_ratio = len([c for c in text if "\u0900" <= c <= "\u097f"]) / max(1, len(text.replace(" ", "")))
    if hindi_ratio > 0.4:
        return "hindi"
    elif any(word in text.lower() for word in ["namaste", "bhaiya", "sir", "arre"]):
        return "hinglish"
    else:
        return "english"

# ===============================================================
# 🤖 8. Generate AI Response (OpenAI GPT-4o-mini)
# ===============================================================
def call_openai(messages):
    """Call OpenAI API for conversational replies"""
    payload = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.85,
        "max_tokens": 500
    }
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}

    for i in range(3):  # Retry up to 3 times if rate-limited
        r = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
        if r.status_code == 429:
            time.sleep(2 ** i)
            continue
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]

    return "Sorry sir, thodi network problem hai. 2 minute mein call karta hoon!"

# ===============================================================
# 🔊 9. Text-to-Speech (TTS) — ElevenLabs + gTTS fallback
# ===============================================================
def speak(text: str, lang: str):
    """
    Convert text to speech.
    Try ElevenLabs first; if fails, use gTTS as fallback.
    """
    file_path = MEMORY_DIR / f"{uuid.uuid4().hex}.mp3"

    # --- Step 1: Try ElevenLabs ---
    try:
        tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE_ID}"
        headers = {"xi-api-key": ELEVEN_API_KEY, "Content-Type": "application/json"}
        payload = {"text": text, "voice_settings": {"stability": 0.65, "similarity_boost": 0.9}}

        r = requests.post(tts_url, json=payload, headers=headers)
        r.raise_for_status()
        with open(file_path, "wb") as f:
            f.write(r.content)
        print("🎤 ElevenLabs voice generated successfully")
        return str(file_path)

    except Exception as e:
        print("⚠️ ElevenLabs TTS failed:", e)

    # --- Step 2: Fallback to gTTS ---
    try:
        tts = gTTS(text)
        tts.save(file_path)
        print("✅ gTTS fallback success (Google TTS)")
        return str(file_path)
    except Exception as gtts_error:
        print("❌ Both ElevenLabs and gTTS failed:", gtts_error)
        return ""

# ===============================================================
# 💬 10. API Endpoint: /api/message
# ===============================================================
class Query(BaseModel):
    session_id: str | None = None
    text: str

@app.post("/api/message")
async def message(q: Query):
    """
    Main chat endpoint.
    - Detects language
    - Calls OpenAI for reply
    - Generates voice (TTS)
    - Saves memory
    """
    session_id = q.session_id or str(uuid.uuid4())
    user_text = q.text.strip()
    if not user_text:
        return {"session_id": session_id, "text": "Bolo na sir! 😊"}

    lang = detect_language(user_text)
    memory = load_memory(session_id)

    # --- Prepare messages for GPT ---
    messages = [
        {
            "role": "system",
            "content": RIVERWOOD_KNOWLEDGE + """
You are speaking to a Riverwood customer.
Current date: November 08, 2025
Reply in pure Hindi if user speaks Hindi.
Reply in pure English if user speaks English.
Reply in Hinglish if mixed.
Always sound like a friend from site office.
Start with: Namaste Sir / Hello Sir / Arre Sir
End with a small question to keep the chat going.
Keep reply under 2 short sentences.
"""
        }
    ]

    # Include last 10 conversation turns for context
    for turn in memory[-10:]:
        messages.append({"role": "user", "content": turn["user"]})
        messages.append({"role": "assistant", "content": turn["ai"]})

    messages.append({"role": "user", "content": user_text})

    # --- Generate response + voice ---
    try:
        ai_text = call_openai(messages)
        audio_path = speak(ai_text, lang)
        save_memory(session_id, user_text, ai_text, audio_path)

        return {
            "session_id": session_id,
            "text": ai_text,
            "audio_path": f"/memory/{Path(audio_path).name}" if audio_path else None
        }
    except Exception as e:
        print("❌ Error:", e)
        error_text = "Sorry sir, system hang ho gaya!" if lang == "hindi" else "Sorry sir, facing some technical issue!"
        return {"session_id": session_id, "text": error_text}

# ===============================================================
# ❤️ 11. Health Check Endpoint
# ===============================================================
@app.get("/api/health")
async def health():
    """Simple check if backend is running"""
    return {"status": "Riverwood AI is LIVE from Kharkhauda site office! 🏗️"}

