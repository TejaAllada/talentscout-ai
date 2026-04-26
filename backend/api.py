"""
AI-Powered Talent Scouting & Engagement Agent — FastAPI Backend
Catalyst Hackathon | Web Version
"""

from __future__ import annotations
import os, json, math, time, datetime
from dataclasses import dataclass, field, asdict
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq

# ── CONFIG ─────────────────────────────────────────────────────────────────
GROQ_MODEL   = "llama-3.3-70b-versatile"
MATCH_WEIGHTS   = {"skill_overlap": 0.40, "experience_delta": 0.25, "domain_fit": 0.20, "keyword_resonance": 0.15}
INTEREST_WEIGHTS = {"sentiment": 0.35, "engagement_depth": 0.40, "enthusiasm_markers": 0.25}
TOP_N = 5

app = FastAPI(title="TalentScout AI", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

# ── DATA MODEL ──────────────────────────────────────────────────────────────
@dataclass
class Candidate:
    id: str; name: str; title: str; years_exp: float; skills: list[str]
    domain: str; education: str; location: str; bio: str
    salary_expectation_lpa: float; notice_period_days: int; open_to_remote: bool
    match_score: float = 0.0; interest_score: float = 0.0
    match_breakdown: dict = field(default_factory=dict)
    match_rationale: str = ""; conversation_log: list[dict] = field(default_factory=list); tier: str = ""

# ── CANDIDATE POOL ──────────────────────────────────────────────────────────
def build_pool() -> list[Candidate]:
    return [
        Candidate("C01","Arjun Mehta","Senior ML Engineer",5.5,["Python","PyTorch","NLP","Transformers","FastAPI","Docker","AWS"],"AI/ML","M.Tech IIT Bombay","Bangalore","Built NLP pipelines at a Series-B fintech; led a 4-person team.",28.0,60,True),
        Candidate("C02","Sneha Rao","Full Stack Developer",3.0,["React","Node.js","MongoDB","TypeScript","GraphQL","Docker"],"Web Dev","B.E. VIT Vellore","Hyderabad","Worked at a product startup; owns the frontend for 200k-user SaaS.",14.0,30,True),
        Candidate("C03","Ravi Shankar","Data Scientist",4.0,["Python","scikit-learn","SQL","Tableau","Statistics","XGBoost","Pandas"],"Data Science","M.Sc Statistics, Delhi University","Delhi","Ex-Mu Sigma analyst turned in-house DS at a logistics firm.",18.0,45,False),
        Candidate("C04","Priya Nair","AI Research Engineer",2.5,["Python","JAX","Transformers","RLHF","LLM Fine-tuning","HuggingFace"],"AI/ML","M.Tech AI, IISc Bangalore","Bangalore","Research intern at MSRI, first-authored two NLP papers.",22.0,30,True),
        Candidate("C05","Karan Verma","DevOps / Platform Engineer",6.0,["Kubernetes","Terraform","CI/CD","AWS","GCP","Python","Prometheus"],"Infrastructure","B.Tech NIT Trichy","Pune","Scaled infra from 10 to 800 microservices at an edtech unicorn.",24.0,90,True),
        Candidate("C06","Divya Krishnamurthy","Product Manager — AI Products",5.0,["Product Strategy","LLM Apps","SQL","A/B Testing","Roadmapping","Python"],"Product/AI","MBA IIM Ahmedabad","Mumbai","PM for a GenAI B2B startup; shipped 3 LLM-powered features.",30.0,60,True),
        Candidate("C07","Aditya Singh","Backend Engineer",2.0,["Go","PostgreSQL","gRPC","Redis","Docker","REST APIs"],"Backend","B.Tech BITS Pilani","Bangalore","Early engineer at a crypto startup; wrote the core transaction service.",16.0,15,True),
        Candidate("C08","Meera Pillai","NLP Engineer",4.5,["Python","spaCy","BERT","Named Entity Recognition","FastAPI","Transformers","LangChain"],"AI/ML","M.Tech CSE, IIIT Hyderabad","Hyderabad","Owns NLP layer at a legal-tech firm; built contract parser used by 40 clients.",23.0,30,True),
        Candidate("C09","Suresh Babu","Data Engineer",7.0,["Spark","Kafka","Airflow","dbt","BigQuery","Python","SQL"],"Data Engineering","B.Tech Andhra University","Chennai","Built real-time data pipelines for India's largest retail chain.",26.0,60,False),
        Candidate("C10","Tanvi Joshi","ML Ops Engineer",3.5,["MLflow","Kubernetes","Python","AWS SageMaker","Docker","FastAPI","PyTorch"],"AI/ML","B.Tech VJTI Mumbai","Mumbai","Manages model serving infra for a recommendation engine with 5M DAU.",19.0,45,True),
        Candidate("C11","Harish Reddy","Generative AI Developer",2.0,["LangChain","OpenAI API","Python","Vector DBs","RAG","FastAPI","Streamlit"],"AI/ML","B.Tech JNTU Hyderabad","Hyderabad","Built a RAG-based internal KB chatbot used by 300 employees.",13.0,30,True),
        Candidate("C12","Ananya Gupta","Senior Software Engineer — AI Infra",6.5,["Python","C++","CUDA","TensorRT","PyTorch","Distributed Systems","Kubernetes"],"AI Infrastructure","M.Tech CSE, IIT Delhi","Bangalore","Worked on NVIDIA's inference optimization team; now at a stealth AI lab.",35.0,90,False),
    ]

# ── GROQ HELPER ─────────────────────────────────────────────────────────────
def groq_chat(messages: list[dict], system: str = "", max_tokens: int = 800, api_key: str = "") -> str:
    c = Groq(api_key=api_key or os.environ.get("GROQ_API_KEY",""))
    payload = ([{"role":"system","content":system}] if system else []) + messages
    r = c.chat.completions.create(model=GROQ_MODEL, messages=payload, max_tokens=max_tokens, temperature=0.7)
    return r.choices[0].message.content.strip()

# ── MODULE 1: JD PARSE ───────────────────────────────────────────────────────
def parse_jd(raw_jd: str, api_key: str) -> dict:
    prompt = f"""You are a senior technical recruiter with deep NLP expertise.
Parse the following Job Description into a strict JSON schema.

JD TEXT:
\"\"\"{raw_jd}\"\"\"

Return ONLY valid JSON (no markdown fences, no explanation) with this exact structure:
{{
  "role_title": "...",
  "role_summary": "2-3 sentence summary",
  "required_skills": ["skill1"],
  "nice_to_have_skills": ["skill1"],
  "min_experience_years": 0,
  "max_experience_years": null,
  "domain": "primary domain e.g. AI/ML, Backend, DevOps",
  "seniority": "Junior | Mid | Senior | Lead | Staff",
  "keywords": ["important domain terms"],
  "soft_skills": ["collaboration"],
  "salary_range_lpa": {{"min": null, "max": null}},
  "location_preference": "...",
  "remote_ok": true
}}"""
    raw = groq_chat([{"role":"user","content":prompt}], max_tokens=900, api_key=api_key)
    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"): raw = raw[4:]
    try:
        return json.loads(raw.strip())
    except:
        s, e = raw.find("{"), raw.rfind("}")+1
        return json.loads(raw[s:e])

# ── MODULE 2: MATCHING ───────────────────────────────────────────────────────
def skill_overlap(cskills, req, nice):
    cl = {s.lower() for s in cskills}
    rl = [s.lower() for s in req]
    nl = [s.lower() for s in nice]
    if not rl: return 0.5
    return min(1.0, sum(1 for s in rl if s in cl)/len(rl) + (sum(1 for s in nl if s in cl)/len(nl)*0.2 if nl else 0))

def exp_score(yoe, mn, mx):
    mx = mx or (mn+5)
    if yoe < mn:
        gap = mn-yoe; return max(0.0,1.0-(gap/mn) if mn>0 else 0.3), f"under by {gap:.1f}yr"
    elif yoe > mx:
        ov = yoe-mx; return max(0.6,1.0-(ov/10)), f"overqualified by {ov:.1f}yr"
    return 1.0, "within range"

def domain_fit(cd, jd):
    cd,jd = cd.lower(),jd.lower()
    if cd==jd: return 1.0
    m={("ai/ml","ai infrastructure"):0.8,("ai infrastructure","ai/ml"):0.8,("data science","ai/ml"):0.7,("ai/ml","data science"):0.7,("backend","web dev"):0.6,("web dev","backend"):0.6,("product/ai","ai/ml"):0.5}
    return m.get((cd,jd),0.2)

def keyword_res(c, kws):
    blob=(c.bio+" "+" ".join(c.skills)+" "+c.title).lower()
    return min(1.0,sum(1 for kw in kws if kw.lower() in blob)/max(len(kws),1))

def compute_scores(candidates, jd):
    for c in candidates:
        ss = skill_overlap(c.skills, jd["required_skills"], jd.get("nice_to_have_skills",[]))
        es, en = exp_score(c.years_exp, float(jd.get("min_experience_years") or 2), jd.get("max_experience_years"))
        ds = domain_fit(c.domain, jd.get("domain",""))
        ks = keyword_res(c, jd.get("keywords",[]))
        c.match_score = round((ss*0.40+es*0.25+ds*0.20+ks*0.15)*100,2)
        c.match_breakdown = {"skill_overlap":round(ss*100,1),"experience_delta":round(es*100,1),"domain_fit":round(ds*100,1),"keyword_resonance":round(ks*100,1),"exp_note":en}
    return sorted(candidates, key=lambda x: x.match_score, reverse=True)

def gen_rationale(c, jd, api_key):
    bd=c.match_breakdown
    prompt=f"""You're a technical recruiter. Write exactly 2 sentences assessing this candidate.
Candidate: {c.name}, {c.title}, {c.years_exp}yr exp. Skills: {', '.join(c.skills)}. Bio: {c.bio}
JD wants: {jd.get('role_title')} in {jd.get('domain')}. Required: {', '.join(jd.get('required_skills',[]))}
Match: skill={bd['skill_overlap']}%, exp={bd['experience_delta']}% ({bd['exp_note']}), domain={bd['domain_fit']}%, keywords={bd['keyword_resonance']}%, overall={c.match_score}%
Be specific about strengths or gaps. No fluff."""
    return groq_chat([{"role":"user","content":prompt}], max_tokens=120, api_key=api_key)

# ── MODULE 3: OUTREACH ───────────────────────────────────────────────────────
def run_conversation(c, jd, api_key):
    sys = f"""You are roleplaying as {c.name}, a {c.title} with {c.years_exp} years experience.
Background: {c.bio}. Salary expectation: Rs.{c.salary_expectation_lpa}LPA. Notice: {c.notice_period_days} days. Remote: {'yes' if c.open_to_remote else 'prefers on-site'}.
Respond naturally, 2-4 sentences. Show personality. Be honest, not generically enthusiastic."""
    turns = [
        f"Hi {c.name.split()[0]}! I came across your profile and think you'd be a strong fit for a {jd.get('role_title')} role. Got a few minutes to chat?",
        f"The role is focused on {jd.get('role_summary','building cutting-edge AI systems')}. What's your current interest level?",
        f"We're looking to close in 4-6 weeks — what does your availability and notice period look like?",
        f"Comp range is Rs.{int(jd.get('salary_range_lpa',{}).get('min',20) or 20)}-{int(jd.get('salary_range_lpa',{}).get('max',35) or 35)}LPA. Does that work for you?",
        f"Last one — where are you hoping to grow in the next 2-3 years?",
    ]
    history, log = [], []
    for msg in turns:
        history.append({"role":"user","content":msg})
        reply = groq_chat(history, system=sys, max_tokens=200, api_key=api_key)
        history.append({"role":"assistant","content":reply})
        log.append({"recruiter":msg,"candidate":reply})
    return log

def score_interest(log, c, api_key):
    convo = "\n".join(f"Recruiter: {t['recruiter']}\n{c.name.split()[0]}: {t['candidate']}" for t in log)
    prompt = f"""Analyze this recruiter-candidate conversation. Score 0.0-1.0 on 3 dimensions.
CONVERSATION:\n{convo}
Return ONLY JSON: {{"sentiment":0.0,"engagement_depth":0.0,"enthusiasm_markers":0.0}}
sentiment=positive tone, engagement_depth=substantive answers, enthusiasm_markers=genuine excitement"""
    raw = groq_chat([{"role":"user","content":prompt}], max_tokens=80, api_key=api_key)
    if "```" in raw: raw=raw.split("```")[1][4 if raw.split("```")[1].startswith("json") else 0:]
    s=json.loads(raw[raw.find("{"):raw.rfind("}")+1])
    return round((s["sentiment"]*0.35+s["engagement_depth"]*0.40+s["enthusiasm_markers"]*0.25)*100,2)

# ── MODULE 4: RANK ───────────────────────────────────────────────────────────
def composite(c): return round(0.6*c.match_score+0.4*c.interest_score,2)
def tier(s): return "Tier 1 — Strong Proceed" if s>=72 else ("Tier 2 — Consider" if s>=50 else "Deprioritize")

# ── API SCHEMAS ──────────────────────────────────────────────────────────────
class RunRequest(BaseModel):
    jd_text: str
    groq_api_key: str

# ── ENDPOINTS ────────────────────────────────────────────────────────────────
@app.get("/health")
def health(): return {"status":"ok","model":GROQ_MODEL}

@app.post("/api/run")
def run_pipeline(req: RunRequest):
    if not req.groq_api_key.strip():
        raise HTTPException(400, "GROQ API key required")
    if len(req.jd_text.strip()) < 50:
        raise HTTPException(400, "JD text too short")

    try:
        # Step 1: Parse JD
        jd = parse_jd(req.jd_text, req.groq_api_key)

        # Step 2: Match
        pool = build_pool()
        ranked = compute_scores(pool, jd)

        # Step 3: Rationales for top N
        for c in ranked[:TOP_N]:
            c.match_rationale = gen_rationale(c, jd, req.groq_api_key)

        # Step 4: Outreach for top N
        for c in ranked[:TOP_N]:
            c.conversation_log = run_conversation(c, jd, req.groq_api_key)
            c.interest_score = score_interest(c.conversation_log, c, req.groq_api_key)

        # Step 5: Final rank
        for c in ranked:
            c.tier = tier(composite(c))
        final = sorted(ranked, key=composite, reverse=True)

        return {
            "jd": jd,
            "candidates": [
                {**asdict(c), "composite_score": composite(c)}
                for c in final
            ],
            "generated_at": datetime.datetime.now().isoformat(),
            "weights": {"match": MATCH_WEIGHTS, "interest": INTEREST_WEIGHTS}
        }
    except Exception as e:
        raise HTTPException(500, str(e))
