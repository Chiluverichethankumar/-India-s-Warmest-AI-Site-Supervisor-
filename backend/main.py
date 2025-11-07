# # import os
# # import uuid
# # import time
# # import json
# # from pathlib import Path

# # import requests
# # from fastapi import FastAPI
# # from fastapi.responses import FileResponse
# # from fastapi.staticfiles import StaticFiles
# # from pydantic import BaseModel
# # from dotenv import load_dotenv
# # from gtts import gTTS  # Text-to-Speech

# # # ---------- Load environment variables ----------
# # env_path = Path(__file__).resolve().parent / ".env"
# # load_dotenv(dotenv_path=env_path)

# # OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# # print("✅ OpenAI Key Loaded:", bool(OPENAI_API_KEY))

# # # ---------- FastAPI App ----------
# # app = FastAPI()

# # # ---------- Serve static frontend ----------
# # STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
# # if STATIC_DIR.exists():
# #     app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# # # ---------- Serve favicon to avoid 404 ----------
# # @app.get("/favicon.ico")
# # async def favicon():
# #     favicon_path = STATIC_DIR / "favicon.ico"
# #     if favicon_path.exists():
# #         return FileResponse(favicon_path)
# #     return {}

# # # ---------- Memory folder ----------
# # MEMORY_DIR = Path(__file__).resolve().parent / "memory"
# # MEMORY_DIR.mkdir(exist_ok=True)

# # # Mount memory folder for serving generated MP3 files
# # app.mount("/memory", StaticFiles(directory=MEMORY_DIR), name="memory")

# # def load_memory(session_id):
# #     file_path = MEMORY_DIR / f"{session_id}.json"
# #     if file_path.exists():
# #         with open(file_path, "r", encoding="utf-8") as f:
# #             return json.load(f)
# #     return []

# # def save_memory(session_id, user_text, ai_text, audio_path):
# #     file_path = MEMORY_DIR / f"{session_id}.json"
# #     memory = load_memory(session_id)
# #     memory.append({
# #         "user": user_text,
# #         "ai": ai_text,
# #         "audio_path": audio_path
# #     })
# #     with open(file_path, "w", encoding="utf-8") as f:
# #         json.dump(memory, f, indent=4, ensure_ascii=False)

# # # ---------- OpenAI Chat ----------
# # def call_openai(system_prompt, conversation):
# #     url = "https://api.openai.com/v1/chat/completions"
# #     headers = {
# #         "Authorization": f"Bearer {OPENAI_API_KEY}",
# #         "Content-Type": "application/json",
# #     }
# #     payload = {
# #         "model": "gpt-4o-mini",
# #         "messages": [{"role": "system", "content": system_prompt}] + conversation,
# #         "max_tokens": 400,
# #         "temperature": 0.7,
# #     }

# #     for attempt in range(3):
# #         r = requests.post(url, headers=headers, json=payload)
# #         if r.status_code == 429:
# #             print("⚠️ OpenAI rate limit — retrying...")
# #             time.sleep(2)
# #             continue
# #         r.raise_for_status()
# #         return r.json()["choices"][0]["message"]["content"]

# #     raise Exception("OpenAI API rate limit exceeded.")

# # # ---------- gTTS Text-to-Speech ----------
# # def call_gtts(text: str):
# #     tts = gTTS(text=text, lang="en")
# #     filename = MEMORY_DIR / f"output_{uuid.uuid4().hex}.mp3"
# #     tts.save(str(filename))
# #     return str(filename)

# # # ---------- API ----------
# # class Query(BaseModel):
# #     session_id: str | None = None
# #     text: str

# # @app.post("/api/message")
# # async def message(q: Query):
# #     session_id = q.session_id or str(uuid.uuid4())
# #     user_text = q.text
# #     try:
# #         memory = load_memory(session_id)
# #         conversation = []
# #         for turn in memory[-5:]:  # last 5 interactions
# #             conversation.append({"role": "user", "content": turn["user"]})
# #             conversation.append({"role": "assistant", "content": turn["ai"]})
# #         conversation.append({"role": "user", "content": user_text})

# #         system_prompt = (
# #             "You are a friendly Indian site supervisor AI. Greet casually in Hindi/English. "
# #             "Keep responses warm and short. Occasionally use 'Sir'/'Madam'. "
# #             "Give construction updates when asked."
# #         )

# #         # Get AI text from OpenAI
# #         ai_text = call_openai(system_prompt, conversation)

# #         # Generate audio using gTTS
# #         audio_path = call_gtts(ai_text)

# #         # Save conversation with audio path
# #         save_memory(session_id, user_text, ai_text, audio_path)

# #         return {
# #             "session_id": session_id,
# #             "text": ai_text,
# #             "audio_path": f"/memory/{Path(audio_path).name}"  # browser-accessible URL
# #         }
# #     except Exception as e:
# #         return {"session_id": session_id, "text": f"⚠️ Error: {str(e)}"}

# # @app.get("/api/health")
# # async def health():
# #     return {"status": "ok"}

# import os
# import uuid
# import time
# import json
# from pathlib import Path

# import requests
# from fastapi import FastAPI
# from fastapi.responses import FileResponse
# from fastapi.staticfiles import StaticFiles
# from pydantic import BaseModel
# from dotenv import load_dotenv
# from gtts import gTTS

# # ---------- Load env ----------
# env_path = Path(__file__).resolve().parent / ".env"
# load_dotenv(dotenv_path=env_path)
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
# print("OpenAI Key Loaded:", bool(OPENAI_API_KEY))

# # ---------- FastAPI ----------
# app = FastAPI()

# # ---------- PATHS ----------
# STATIC_DIR = Path(__file__).resolve().parent.parent / "static"
# MEMORY_DIR = Path(__file__).resolve().parent / "memory"
# MEMORY_DIR.mkdir(exist_ok=True)

# # ---------- SERVE EVERYTHING ----------
# app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
# app.mount("/memory", StaticFiles(directory=MEMORY_DIR), name="memory")

# # THIS IS THE MAGIC LINE - ROOT PAGE
# @app.get("/")
# async def root():
#     return FileResponse(STATIC_DIR / "index.html")

# @app.get("/favicon.ico")
# async def favicon():
#     return FileResponse(STATIC_DIR / "favicon.ico")

# # ---------- Memory folder ----------
# MEMORY_DIR = Path(__file__).resolve().parent / "memory"
# MEMORY_DIR.mkdir(exist_ok=True)

# # Mount memory folder for serving generated MP3 files
# app.mount("/memory", StaticFiles(directory=MEMORY_DIR), name="memory")

# def load_memory(session_id):
#     file_path = MEMORY_DIR / f"{session_id}.json"
#     if file_path.exists():
#         with open(file_path, "r", encoding="utf-8") as f:
#             return json.load(f)
#     return []

# def save_memory(session_id, user_text, ai_text, audio_path):
#     file_path = MEMORY_DIR / f"{session_id}.json"
#     memory = load_memory(session_id)
#     memory.append({
#         "user": user_text,
#         "ai": ai_text,
#         "audio_path": audio_path
#     })
#     with open(file_path, "w", encoding="utf-8") as f:
#         json.dump(memory, f, indent=4, ensure_ascii=False)

# # ---------- OpenAI Chat ----------
# def call_openai(system_prompt, conversation):
#     url = "https://api.openai.com/v1/chat/completions"
#     headers = {
#         "Authorization": f"Bearer {OPENAI_API_KEY}",
#         "Content-Type": "application/json",
#     }
#     payload = {
#         "model": "gpt-4o-mini",
#         "messages": [{"role": "system", "content": system_prompt}] + conversation,
#         "max_tokens": 400,
#         "temperature": 0.7,
#     }

#     for attempt in range(3):
#         r = requests.post(url, headers=headers, json=payload)
#         if r.status_code == 429:
#             print("⚠️ OpenAI rate limit — retrying...")
#             time.sleep(2)
#             continue
#         r.raise_for_status()
#         return r.json()["choices"][0]["message"]["content"]

#     raise Exception("OpenAI API rate limit exceeded.")

# # ---------- gTTS Text-to-Speech ----------
# def call_gtts(text: str):
#     tts = gTTS(text=text, lang="en")
#     filename = MEMORY_DIR / f"output_{uuid.uuid4().hex}.mp3"
#     tts.save(str(filename))
#     return str(filename)

# # ---------- API ----------
# class Query(BaseModel):
#     session_id: str | None = None
#     text: str

# @app.post("/api/message")
# async def message(q: Query):
#     session_id = q.session_id or str(uuid.uuid4())
#     user_text = q.text
#     try:
#         memory = load_memory(session_id)
#         conversation = []
#         for turn in memory[-5:]:  # last 5 interactions
#             conversation.append({"role": "user", "content": turn["user"]})
#             conversation.append({"role": "assistant", "content": turn["ai"]})
#         conversation.append({"role": "user", "content": user_text})

#         system_prompt = (
#             "You are a friendly Indian site supervisor AI. Greet casually in Hindi/English. "
#             "Keep responses warm and short. Occasionally use 'Sir'/'Madam'. "
#             "Give construction updates when asked."
#         )

#         # Get AI text from OpenAI
#         ai_text = call_openai(system_prompt, conversation)

#         # Generate audio using gTTS
#         audio_path = call_gtts(ai_text)

#         # Save conversation with audio path
#         save_memory(session_id, user_text, ai_text, audio_path)

#         return {
#             "session_id": session_id,
#             "text": ai_text,
#             "audio_path": f"/memory/{Path(audio_path).name}"  # browser-accessible URL
#         }
#     except Exception as e:
#         return {"session_id": session_id, "text": f"⚠️ Error: {str(e)}"}

# @app.get("/api/health")
# async def health():
#     return {"status": "ok"}

# backend/main.py
import os
import uuid
import time
import json
from pathlib import Path

import requests
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from gtts import gTTS

# ---------- Load env ----------
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# ---------- FastAPI ----------
app = FastAPI()

# ---------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",],  # add your domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- PATHS ----------
MEMORY_DIR = Path(__file__).resolve().parent / "memory"
MEMORY_DIR.mkdir(exist_ok=True)
DIST_DIR = Path(__file__).resolve().parent.parent / "frontend" / "project" / "dist"

app.mount("/memory", StaticFiles(directory=MEMORY_DIR), name="memory")

# ---------- Serve Frontend ----------
@app.get("/")
async def root():
    return FileResponse(DIST_DIR / "index.html")

@app.get("/{full_path:path}")
async def serve(full_path: str):
    file = DIST_DIR / full_path
    if file.exists() and file.is_file():
        return FileResponse(file)
    return FileResponse(DIST_DIR / "index.html")

# ---------- RIVERWOOD FULL KNOWLEDGE BASE ----------
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
- Electricity poles installed, wiring in progress"
"""

# ---------- Memory ----------
def load_memory(session_id: str):
    file = MEMORY_DIR / f"{session_id}.json"
    return json.load(file.open(encoding="utf-8")) if file.exists() else []

def save_memory(session_id: str, user: str, ai: str, audio: str):
    file = MEMORY_DIR / f"{session_id}.json"
    data = load_memory(session_id)
    data.append({"user": user, "ai": ai, "audio_path": audio})
    file.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

# ---------- Language Detector ----------
def detect_language(text: str) -> str:
    hindi_ratio = len([c for c in text if "\u0900" <= c <= "\u097f"]) / max(1, len(text.replace(" ", "")))
    if hindi_ratio > 0.4:
        return "hindi"
    elif "namaste" in text.lower() or "bhaiya" in text.lower() or "sir" in text.lower():
        return "hinglish"
    else:
        return "english"

# ---------- OpenAI ----------
def call_openai(messages):
    payload = {
        "model": "gpt-4o-mini",
        "messages": messages,
        "temperature": 0.85,
        "max_tokens": 500
    }
    headers = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}
    
    for i in range(3):
        r = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers)
        if r.status_code == 429:
            time.sleep(2 ** i)
            continue
        r.raise_for_status()
        return r.json()["choices"][0]["message"]["content"]
    return "Sorry sir, thodi network problem hai. 2 minute mein call karta hoon!"

# ---------- TTS ----------
def speak(text: str, lang: str):
    if lang == "hindi":
        tts = gTTS(text=text, lang="hi", tld="co.in", slow=False)
    else:
        tts = gTTS(text=text, lang="en", tld="co.in", slow=False)  # Indian English
    file = MEMORY_DIR / f"{uuid.uuid4().hex}.mp3"
    tts.save(str(file))
    return str(file)

# ---------- API ----------
class Query(BaseModel):
    session_id: str | None = None
    text: str

@app.post("/api/message")
async def message(q: Query):
    session_id = q.session_id or str(uuid.uuid4())
    user_text = q.text.strip()
    if not user_text:
        return {"session_id": session_id, "text": "Bolo na sir! 😊"}

    lang = detect_language(user_text)

    # Build conversation with FULL Riverwood knowledge
    memory = load_memory(session_id)
    messages = [
        {"role": "system", "content": RIVERWOOD_KNOWLEDGE + f"""
You are speaking to a Riverwood customer.
Current date: November 07, 2025
Reply in pure Hindi if user speaks Hindi
Reply in pure English if user speaks English  
Reply in Hinglish if mixed
Always sound like a friend from site office
Start with: Namaste Sir / Hello Sir / Arre Sir
End with question to continue chat
Keep reply under 2 sentences
""" }
    ]

    # Add last 10 turns for memory
    for turn in memory[-10:]:
        messages.append({"role": "user", "content": turn["user"]})
        messages.append({"role": "assistant", "content": turn["ai"]})
    
    messages.append({"role": "user", "content": user_text})

    try:
        ai_text = call_openai(messages)
        audio_path = speak(ai_text, lang)
        save_memory(session_id, user_text, ai_text, audio_path)

        return {
            "session_id": session_id,
            "text": ai_text,
            "audio_path": f"/memory/{Path(audio_path).name}"
        }
    except Exception as e:
        error = "Sorry sir, system hang ho gaya!" if lang == "hindi" else "Sorry sir, facing some technical issue!"
        return {"session_id": session_id, "text": error}

@app.get("/api/health")
async def health():
    return {"status": "Riverwood AI is LIVE from Kharkhauda site office! 🏗️"}