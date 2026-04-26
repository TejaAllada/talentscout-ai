import { useState } from 'react';
import CandidateCard from './CandidateCard';
import JDSummary from './JDSummary';

export default function Results({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('shortlist');
  const [expandedId, setExpandedId] = useState(null);

  const { jd, candidates, generated_at, weights } = data;
  const tier1 = candidates.filter(c => c.tier.includes('Tier 1'));
  const tier2 = candidates.filter(c => c.tier.includes('Tier 2'));
  const deprio = candidates.filter(c => c.tier.includes('Deprioritize'));

  const exportCSV = () => {
    const headers = ['Rank','Name','Title','Domain','Location','Exp(yr)','Match%','Interest%','Composite%','Tier','Assessment'];
    const rows = candidates.map((c, i) => [
      i + 1, c.name, c.title, c.domain, c.location, c.years_exp,
      c.match_score, c.interest_score, c.composite_score, c.tier,
      `"${(c.match_rationale || '').replace(/"/g, "'")}"`,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = `talentscout_${jd.role_title?.replace(/\s+/g,'_')}_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '2rem', animation: 'fadeUp 0.5s ease both' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
            RESULTS READY
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: '2rem', lineHeight: 1.1 }}>
            {jd.role_title || 'Role'}
          </h2>
          <div style={{ color: '#888', fontSize: 13, fontFamily: 'var(--mono)', marginTop: '0.3rem' }}>
            {new Date(generated_at).toLocaleString()} · {candidates.length} candidates evaluated
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button onClick={exportCSV} style={{
            background: 'white', border: '1px solid var(--border)', borderRadius: 8,
            padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: 13,
            fontFamily: 'var(--sans)', fontWeight: 500, color: 'var(--ink)'
          }}>
            ↓ Export CSV
          </button>
          <button onClick={onReset} style={{
            background: 'var(--ink)', color: 'var(--paper)', border: 'none',
            borderRadius: 8, padding: '0.6rem 1.2rem', cursor: 'pointer',
            fontSize: 13, fontFamily: 'var(--sans)', fontWeight: 500
          }}>
            ← New Run
          </button>
        </div>
      </div>

      {/* Score Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
        {[
          { label: 'Tier 1 Candidates', value: tier1.length, color: 'var(--tier1)' },
          { label: 'Tier 2 Candidates', value: tier2.length, color: 'var(--tier2)' },
          { label: 'Deprioritized', value: deprio.length, color: '#aaa' },
          { label: 'Top Score', value: `${candidates[0]?.composite_score?.toFixed(1)}%`, color: 'var(--gold)' },
        ].map(s => (
          <div key={s.label} style={{
            background: 'white', border: '1px solid var(--border)', borderRadius: 10,
            padding: '1rem', textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, color: s.color, fontFamily: 'var(--mono)' }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
        {['shortlist', 'jd', 'weights'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '0.6rem 1rem', fontFamily: 'var(--sans)', fontSize: 14,
            fontWeight: activeTab === tab ? 600 : 400,
            color: activeTab === tab ? 'var(--ink)' : '#888',
            borderBottom: activeTab === tab ? '2px solid var(--ink)' : '2px solid transparent',
            marginBottom: '-1px', transition: 'all 0.15s'
          }}>
            {tab === 'shortlist' ? 'Ranked Shortlist' : tab === 'jd' ? 'JD Analysis' : 'Score Weights'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'shortlist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {candidates.map((c, i) => (
            <CandidateCard
              key={c.id} candidate={c} rank={i + 1}
              expanded={expandedId === c.id}
              onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
            />
          ))}
        </div>
      )}

      {activeTab === 'jd' && <JDSummary jd={jd} />}

      {activeTab === 'weights' && <WeightsView weights={weights} />}
    </div>
  );
}

function WeightsView({ weights }) {
  const sections = [
    { title: 'Match Score Weights (60% of Composite)', data: weights.match },
    { title: 'Interest Score Weights (40% of Composite)', data: weights.interest },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {sections.map(sec => (
        <div key={sec.title} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '1.25rem', color: '#555' }}>
            {sec.title}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {Object.entries(sec.data).map(([key, val]) => (
              <div key={key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: '#444' }}>
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600, color: 'var(--gold)' }}>
                    {(val * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ height: 6, background: 'var(--cream)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${val * 100}%`, background: 'var(--gold)',
                    borderRadius: 3, transition: 'width 1s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{
        background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 10,
        padding: '1rem 1.5rem', fontFamily: 'var(--mono)', fontSize: 13, color: '#555', lineHeight: 1.7
      }}>
        <strong>Composite Formula:</strong> (Match Score × 0.60) + (Interest Score × 0.40)
      </div>
    </div>
  );
}
