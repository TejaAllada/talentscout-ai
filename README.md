# 🤖 TalentScout AI — Catalyst Hackathon 2026

> **AI-Powered Talent Scouting & Engagement Agent**  
> Built by **Allada Teja Sai Kumar** · Powered by Groq (FREE) + LLaMA 3.3 70B

A full-stack AI agent that takes a raw Job Description and autonomously:
1. **Parses** the JD into a structured schema using LLaMA 3.3 70B
2. **Matches** 12 diverse candidates using weighted multi-factor scoring
3. **Simulates** 5-turn recruiter ↔ candidate outreach conversations
4. **Ranks** candidates with explainability, tier labels, and CSV export

---

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| Frontend | `https://your-app.vercel.app` *(deploy below)* |
| Backend API | `https://your-backend.onrender.com` *(deploy below)* |

---

## 🏗️ Architecture

```
talent-scout/
├── backend/          # FastAPI Python backend
│   ├── api.py        # All 4 pipeline modules as REST endpoints
│   ├── requirements.txt
│   └── render.yaml   # Render.com deployment config
└── frontend/         # React frontend
    ├── src/
    │   ├── App.js
    │   ├── components/
    │   │   ├── Hero.js          # Landing page
    │   │   ├── RunForm.js       # JD input + API key
    │   │   ├── Results.js       # Results dashboard
    │   │   ├── CandidateCard.js # Expandable candidate row
    │   │   ├── JDSummary.js     # Parsed JD viewer
    │   │   └── Footer.js
    │   └── index.css
    ├── vercel.json   # Vercel deployment config
    └── .env.example  # Environment variable template
```

---

## ⚙️ Pipeline Modules

| Module | What it does |
|--------|-------------|
| **Module 1 — JD Parsing** | LLaMA extracts role, skills, domain, seniority, salary from raw text |
| **Module 2 — Candidate Matching** | Weighted scoring: skill overlap (40%), experience (25%), domain fit (20%), keyword resonance (15%) |
| **Module 3 — AI Outreach** | 5-turn simulated conversation per top candidate, scored on sentiment/engagement/enthusiasm |
| **Module 4 — Ranked Shortlist** | Composite = 0.6×Match + 0.4×Interest, with Tier 1/2/Deprioritize labels |

---

## 🛠️ Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn api:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local: REACT_APP_BACKEND_URL=http://localhost:8000
npm start
```

---

## 🌐 Deployment (Free)

### Step 1 — Deploy Backend to Render
1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New Web Service → Connect repo
3. **Root Directory:** `backend`
4. **Build Command:** `pip install -r requirements.txt`
5. **Start Command:** `uvicorn api:app --host 0.0.0.0 --port $PORT`
6. Copy the live URL (e.g. `https://talentscout-backend.onrender.com`)

### Step 2 — Deploy Frontend to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import repo
2. **Root Directory:** `frontend`
3. **Environment Variable:** `REACT_APP_BACKEND_URL` = your Render URL from Step 1
4. Deploy → get your live link ✅

---

## 🔑 API Key

Get a **free** Groq API key at [console.groq.com](https://console.groq.com).  
The key is entered in the UI at runtime — never stored or logged.

---

## 🧠 Tech Stack

| Layer | Tech |
|-------|------|
| LLM | LLaMA 3.3 70B via Groq API (free) |
| Backend | Python 3.11 · FastAPI · Uvicorn |
| Frontend | React 18 · vanilla CSS |
| Hosting | Render (backend) · Vercel (frontend) |

---

*Built for Catalyst Hackathon 2026 · Apache 2.0 License*
