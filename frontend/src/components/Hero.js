const DEMO_JD = `Senior AI/ML Engineer — Conversational AI Products

We are building next-generation AI agents for enterprise customers and are
looking for a Senior ML/AI Engineer to join our core product team.

Responsibilities:
- Design and ship LLM-powered features (RAG, tool use, agentic workflows)
- Fine-tune and evaluate open-source language models
- Deploy scalable inference pipelines with FastAPI and Docker

Requirements:
- 4+ years of hands-on ML/AI engineering experience
- Strong Python; PyTorch or JAX preferred
- Hands-on with Transformers, LLM APIs, or HuggingFace ecosystem
- Familiarity with vector databases and RAG architectures

Nice to have:
- MLflow, Kubernetes / Docker for model serving
- NLP publications or open-source contributions

Compensation: 20-32 LPA depending on experience
Location: Bangalore or Hyderabad (remote-first)`;

export default function Hero({ onStart }) {
  return (
    <div style={{ flex: 1 }}>
      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid var(--border)', padding: '1rem 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 28, height: 28, background: 'var(--ink)', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span style={{ color: 'var(--gold)', fontSize: 14, fontWeight: 700 }}>TS</span>
          </div>
          <span style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem' }}>TalentScout AI</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{
            fontSize: 11, fontFamily: 'var(--mono)', background: 'var(--cream)',
            padding: '0.2rem 0.6rem', borderRadius: 20, color: '#666',
            border: '1px solid var(--border)'
          }}>
            Catalyst Hackathon 2026
          </span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '5rem 2rem 3rem',
        textAlign: 'center', animation: 'fadeUp 0.6s ease both'
      }}>
        <div style={{
          display: 'inline-block', background: 'var(--cream)', border: '1px solid var(--border)',
          borderRadius: 20, padding: '0.3rem 1rem', marginBottom: '2rem',
          fontFamily: 'var(--mono)', fontSize: 12, color: '#666'
        }}>
          Powered by Groq · LLaMA 3.3 70B · Free
        </div>

        <h1 style={{
          fontFamily: 'var(--serif)', fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
          lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-0.02em'
        }}>
          AI-Powered Talent<br />
          <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Scouting & Engagement</span>
        </h1>

        <p style={{
          fontSize: '1.1rem', color: '#555', lineHeight: 1.7,
          maxWidth: 580, margin: '0 auto 2.5rem', fontWeight: 300
        }}>
          Paste a Job Description. Watch the AI parse it, match 12 candidates with
          weighted scoring, simulate real outreach conversations, and return a
          ranked shortlist with full explainability.
        </p>

        <button onClick={onStart} style={{
          background: 'var(--ink)', color: 'var(--paper)', border: 'none',
          padding: '0.9rem 2.5rem', borderRadius: 8, fontSize: '1rem',
          fontFamily: 'var(--sans)', fontWeight: 500, cursor: 'pointer',
          transition: 'all 0.2s', letterSpacing: '0.01em'
        }}
          onMouseEnter={e => { e.target.style.background = '#222'; e.target.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.target.style.background = 'var(--ink)'; e.target.style.transform = 'translateY(0)'; }}
        >
          Launch Agent →
        </button>
      </div>

      {/* 4-step pipeline */}
      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '0 2rem 4rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem'
      }}>
        {[
          { num: '01', title: 'JD Parsing', desc: 'LLaMA extracts role, skills, domain, seniority & salary' },
          { num: '02', title: 'Candidate Matching', desc: 'Weighted cosine scoring across 12 real-world profiles' },
          { num: '03', title: 'AI Outreach', desc: '5-turn recruiter ↔ candidate chat per shortlisted profile' },
          { num: '04', title: 'Ranked Shortlist', desc: 'Composite score with tier labels & full rationale' },
        ].map((s, i) => (
          <div key={s.num} style={{
            background: 'white', border: '1px solid var(--border)', borderRadius: 10,
            padding: '1.25rem', animation: `fadeUp 0.5s ${0.1 * i}s ease both`
          }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)',
              marginBottom: '0.6rem', letterSpacing: '0.05em'
            }}>MODULE {s.num}</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{s.title}</div>
            <div style={{ fontSize: 13, color: '#666', lineHeight: 1.5 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Demo JD preview */}
      <div style={{
        maxWidth: 700, margin: '0 auto 4rem', padding: '0 2rem',
        animation: 'fadeUp 0.7s 0.2s ease both'
      }}>
        <div style={{
          background: 'white', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden'
        }}>
          <div style={{
            background: 'var(--cream)', borderBottom: '1px solid var(--border)',
            padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f87171' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#4ade80' }} />
            <span style={{ marginLeft: '0.5rem', fontFamily: 'var(--mono)', fontSize: 11, color: '#999' }}>
              demo_jd.txt — click "Launch Agent" to use this
            </span>
          </div>
          <pre style={{
            fontFamily: 'var(--mono)', fontSize: 12, color: '#444', lineHeight: 1.7,
            padding: '1.25rem', maxHeight: 200, overflow: 'hidden',
            position: 'relative', whiteSpace: 'pre-wrap'
          }}>
            {DEMO_JD.substring(0, 420)}
            <div style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
              background: 'linear-gradient(transparent, white)'
            }} />
          </pre>
        </div>
      </div>
    </div>
  );
}
