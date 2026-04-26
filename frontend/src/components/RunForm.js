import { useState } from 'react';

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

export default function RunForm({ onSubmit, onBack, error }) {
  const [jdText, setJdText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  const handleSubmit = () => {
    const jd = jdText.trim() || DEMO_JD;
    if (!apiKey.trim()) return alert('Please enter your Groq API key');
    onSubmit({ jdText: jd, apiKey: apiKey.trim() });
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem', animation: 'fadeUp 0.4s ease both' }}>
      {/* Back */}
      <button onClick={onBack} style={{
        background: 'none', border: 'none', cursor: 'pointer', color: '#888',
        fontFamily: 'var(--mono)', fontSize: 13, marginBottom: '2rem', padding: 0,
        display: 'flex', alignItems: 'center', gap: '0.4rem'
      }}>
        ← Back
      </button>

      <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', marginBottom: '0.5rem' }}>
        Configure Your Run
      </h2>
      <p style={{ color: '#666', fontSize: 14, marginBottom: '2rem', lineHeight: 1.6 }}>
        Paste a Job Description below. Leave blank to use the built-in Senior AI/ML Engineer demo JD.
      </p>

      {/* JD Input */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'
        }}>
          <label style={{ fontWeight: 600, fontSize: 14 }}>Job Description</label>
          <button onClick={() => setJdText(DEMO_JD)} style={{
            background: 'none', border: '1px solid var(--border)', borderRadius: 6,
            padding: '0.2rem 0.6rem', cursor: 'pointer', fontFamily: 'var(--mono)',
            fontSize: 11, color: '#666'
          }}>
            Load Demo JD
          </button>
        </div>
        <textarea
          value={jdText}
          onChange={e => setJdText(e.target.value)}
          placeholder="Paste JD here… or leave blank for demo"
          style={{
            width: '100%', minHeight: 260, padding: '1rem', borderRadius: 8,
            border: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 13,
            background: 'white', resize: 'vertical', outline: 'none', lineHeight: 1.6,
            color: 'var(--ink)'
          }}
        />
      </div>

      {/* API Key */}
      <div style={{ marginBottom: '2rem' }}>
        <label style={{ fontWeight: 600, fontSize: 14, display: 'block', marginBottom: '0.5rem' }}>
          Groq API Key
        </label>
        <p style={{ fontSize: 12, color: '#888', marginBottom: '0.5rem', lineHeight: 1.5 }}>
          Free at <a href="https://console.groq.com" target="_blank" rel="noreferrer"
            style={{ color: 'var(--gold)' }}>console.groq.com</a> — never stored, sent only to Groq.
        </p>
        <div style={{ position: 'relative' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="gsk_••••••••••••••••••••••••••••••••"
            style={{
              width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', borderRadius: 8,
              border: '1px solid var(--border)', fontFamily: 'var(--mono)', fontSize: 13,
              background: 'white', outline: 'none', color: 'var(--ink)'
            }}
          />
          <button onClick={() => setShowKey(v => !v)} style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
            background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', fontSize: 16
          }}>
            {showKey ? '🙈' : '👁'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fff0ee', border: '1px solid #f0b8aa', borderRadius: 8,
          padding: '0.75rem 1rem', color: '#8b3a2a', fontFamily: 'var(--mono)',
          fontSize: 13, marginBottom: '1.5rem'
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Info box */}
      <div style={{
        background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 8,
        padding: '1rem', marginBottom: '2rem', fontSize: 13, color: '#555', lineHeight: 1.6
      }}>
        <strong>What happens next:</strong> The AI will parse your JD, score 12 candidates,
        run 5-turn outreach conversations, and return a full ranked shortlist.
        Expect <strong>2-3 minutes</strong> (Groq is fast but we do ~25 LLM calls).
      </div>

      <button onClick={handleSubmit} style={{
        width: '100%', background: 'var(--ink)', color: 'var(--paper)', border: 'none',
        padding: '1rem', borderRadius: 8, fontSize: '1rem', fontFamily: 'var(--sans)',
        fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.01em'
      }}
        onMouseEnter={e => { e.target.style.background = '#222'; }}
        onMouseLeave={e => { e.target.style.background = 'var(--ink)'; }}
      >
        Run TalentScout Agent →
      </button>
    </div>
  );
}
