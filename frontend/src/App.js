import { useState } from 'react';
import Hero from './components/Hero';
import RunForm from './components/RunForm';
import Results from './components/Results';
import Footer from './components/Footer';

const BACKEND = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

export default function App() {
  const [phase, setPhase] = useState('home'); // home | running | done
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState([]);

  const addLog = (msg) => setProgress(p => [...p, { msg, ts: Date.now() }]);

  const handleRun = async ({ jdText, apiKey }) => {
    setPhase('running');
    setError('');
    setProgress([]);

    addLog('Parsing Job Description with LLaMA 3.3 70B…');

    try {
      const res = await fetch(`${BACKEND}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jd_text: jdText, groq_api_key: apiKey }),
      });

      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || 'Server error');
      }

      const data = await res.json();
      addLog('Matching 12 candidates with weighted scoring…');
      setTimeout(() => addLog('Running AI outreach simulations (5 turns each)…'), 400);
      setTimeout(() => addLog('Scoring interest & generating final rankings…'), 800);
      setTimeout(() => {
        setResult(data);
        setPhase('done');
      }, 1200);
    } catch (err) {
      setError(err.message);
      setPhase('home');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {phase === 'home' && (
        <>
          <Hero onStart={() => setPhase('form')} />
          {error && (
            <div style={{
              margin: '0 auto 2rem', maxWidth: 640, background: '#fff0ee',
              border: '1px solid #f0b8aa', borderRadius: 8, padding: '1rem 1.5rem',
              color: '#8b3a2a', fontFamily: 'var(--mono)', fontSize: 13
            }}>
              ⚠ {error}
            </div>
          )}
        </>
      )}
      {phase === 'form' && (
        <RunForm onSubmit={handleRun} onBack={() => setPhase('home')} error={error} />
      )}
      {phase === 'running' && <LoadingScreen logs={progress} />}
      {phase === 'done' && result && (
        <Results data={result} onReset={() => { setPhase('home'); setResult(null); }} />
      )}
      <Footer />
    </div>
  );
}

function LoadingScreen({ logs }) {
  return (
    <div style={{
      minHeight: '80vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '2rem', padding: '2rem'
    }}>
      {/* Spinner */}
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        border: '3px solid var(--cream)',
        borderTopColor: 'var(--gold)',
        animation: 'spin 0.9s linear infinite'
      }} />
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--serif)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          Scouting Talent…
        </div>
        <div style={{ color: '#666', fontSize: 14, fontFamily: 'var(--mono)' }}>
          This takes 2-3 minutes — real AI reasoning happening
        </div>
      </div>
      <div style={{
        width: '100%', maxWidth: 480, background: 'white', borderRadius: 12,
        border: '1px solid var(--border)', padding: '1.25rem 1.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.6rem'
      }}>
        {logs.map((l, i) => (
          <div key={l.ts} style={{
            fontFamily: 'var(--mono)', fontSize: 13, color: '#444',
            animation: 'fadeUp 0.4s ease both',
            display: 'flex', gap: '0.6rem', alignItems: 'flex-start'
          }}>
            <span style={{ color: 'var(--gold)', flexShrink: 0 }}>›</span>
            {l.msg}
          </div>
        ))}
        {logs.length < 4 && (
          <div style={{
            fontFamily: 'var(--mono)', fontSize: 13, color: '#bbb',
            animation: 'pulse 1.2s ease infinite'
          }}>
            …
          </div>
        )}
      </div>
    </div>
  );
}
