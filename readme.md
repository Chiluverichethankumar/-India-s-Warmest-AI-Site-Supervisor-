# I Built India’s Warmest AI Site Supervisor in 6 Hours

Meet **riverwood-AI** — your friendly AI *dost* from *Riverwood Estate, Kharkhauda*!  
He remembers your last chat, speaks Hindi, English, or English perfectly, and asks you the most important question —  
**“Chai pee li, sir?”** ☕

**🤖 riverwood-AI can:**
- Talk in natural Indian voice (via gTTS, `.co.in` accent)
- Switch seamlessly between Hindi, English, and English
- Remember conversations across sessions
- Know your plots, EMIs, and project updates
- Feel *alive* — he truly sounds Indian!


```bash

## 💸 Tech Stack (Under ₹150/month)

| Layer | Technology | Cost |
|:--------|:---------------------------|:----------|
| Frontend | React + Vite + Tailwind | Free |
| Backend | FastAPI (Python) | Free |
| AI Brain | GPT-4o-mini | $0.15 / 1M tokens |
| Voice | gTTS (Indian accent) | Free |
| Hosting | Vercel (frontend) + Render (backend) | Free tier |
| Memory | JSON files (per session) | Free |

**🪙 Total Monthly Cost:** ₹97 (for up to 1,000 daily users)
```

## 📂 Project Structure

```python
riverwood-voice-agent/
├── backend/
│ ├── main.py ← The Brain (FastAPI + GPT-4o-mini)
│ ├── memory/ ← Auto-created session memories
│ ├── .env ← Your OPENAI_API_KEY here
│ └── requirements.txt
├── frontend/project/
│ ├── src/App.tsx ← Beautiful UI with branding
│ ├── public/logo.png ← Riverwood logo
│ └── vite.config.ts ← Proxy setup
└── README.md
```

### 🧠 Step 1: Backend — The Soul (`main.py`)
- 178 lines of structured FastAPI logic  
- Injected Riverwood knowledge base in the system prompt  
- Auto language detection (Hindi/English/English)  
- Persistent memory (last 10 messages per session)  
- Indian voice using gTTS (`tld="co.in"`)  
- GPT-4o-mini for contextual, ultra-fast replies  


## 🎨 Step 2: Frontend — The Face (`App.tsx`)
- React + Vite + Tailwind  
- Real-time voice recording (Web Speech API)  
- Auto-play audio replies  
- Beautiful Riverwood theme & logo  
- "LIVE from Site Office" blinking badge  
- Add `rajesh.jpg` for a human-like avatar  

### 🔗 Step 3: Connection Magic (`vite.config.ts`)
```python
proxy: {
'/api': 'http://localhost:8000',
'/memory': 'http://localhost:8000'
}

```
## 🏃‍♂️ Run Locally (2 Commands)
```python
cd backend
uvicorn main:app --reload --port 8000
```
undefined

### Terminal 2 - Start the Beautiful Face
```python
cd frontend/project
npm run dev
```
### 🪄 Try Rajesh Yourself

**English:** “Hello Rajesh, what's the latest site update?”  
**Hindi:** [translate:राजेश भाई, रोड का काम कब तक पूरा होगा?]  
**English:** “Bhai clubhouse kab khulega full?”

Rajesh automatically detects your language and replies accordingly 🗣️

## 💬 Sample Conversation

**User:** Bhai mera plot no. 135 hai, EMI kitni bachi?  
**Rajesh:** Arre sir, aapka 135 wala prime location plot!  
Sirf 14 EMI bachi hai – ₹18,700/month.  
December 2026 mein aapke haath mein registry!  
[translate:चाय पी ली क्या आज?] ☕


## ✨ Why Rajesh Is Special
```python
| Feature | Implemented? | Notes |
|:--------------------|:-------------:|:------------------------------------------|
| Human-like Indian voice | ✅ | gTTS + `.co.in` accent |
| Hindi/English/English | ✅ | Auto detection |
| Memory (remembers chat) | ✅ | JSON per session |
| Construction updates | ✅ | Real project data |
| Ultra-low latency | ✅ | GPT-4o-mini + proxy |
| Beautiful UI + Logo | ✅ | Emerald theme |
| Easy 2-click deploy | ✅ | Vercel + Render |
```

## 💰 Estimated Infra Cost (10,000 Users / Month)
```python
| Resource | Usage | Cost |
|:----------------|:--------------------|:-------------|
| GPT-4o-mini | ≈ 8M tokens | ₹1,200 |
| Render | Free tier | ₹0 |
| Vercel | Free tier | ₹0 |
```
**👉 Total: ₹1,200/month (~₹0.12 per customer)**


## 🏁 Final Thought

*"riverwood-AI isn't just an AI — he's that friendly site supervisor who never forgets your chai order."* ☕