export default function CandidateCard({ candidate: c, rank, expanded, onToggle }) {
  const comp = c.composite_score;
  const tierColor = c.tier.includes('Tier 1') ? 'var(--tier1)' : c.tier.includes('Tier 2') ? 'var(--tier2)' : '#aaa';
  const tierBg = c.tier.includes('Tier 1') ? '#f0faf3' : c.tier.includes('Tier 2') ? '#fffbeb' : '#f8f8f8';

  const ScoreBar = ({ label, value, weight }) => (
    <div style={{ marginBottom: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
        <span style={{ fontSize: 12, color: '#666', fontFamily: 'var(--mono)' }}>
          {label} <span style={{ color: '#bbb' }}>w={weight}</span>
        </span>
        <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'var(--mono)', color: 'var(--ink)' }}>
          {value?.toFixed(0)}%
        </span>
      </div>
      <div style={{ height: 5, background: 'var(--cream)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${value || 0}%`,
          background: value >= 70 ? 'var(--sage)' : value >= 40 ? 'var(--gold)' : 'var(--rust)',
          borderRadius: 3, transition: 'width 0.8s ease'
        }} />
      </div>
    </div>
  );

  return (
    <div style={{
      background: 'white', border: '1px solid var(--border)', borderRadius: 10,
      overflow: 'hidden', transition: 'box-shadow 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
    >
      {/* Card Header */}
      <div onClick={onToggle} style={{
        padding: '1.1rem 1.25rem', cursor: 'pointer',
        display: 'grid', gridTemplateColumns: '2rem 1fr auto', gap: '1rem', alignItems: 'center'
      }}>
        {/* Rank */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 600,
          color: rank <= 3 ? 'var(--gold)' : '#bbb'
        }}>
          #{rank}
        </div>

        {/* Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{c.name}</span>
            <span style={{
              fontSize: 11, padding: '0.15rem 0.5rem', borderRadius: 20,
              background: tierBg, color: tierColor, fontFamily: 'var(--mono)',
              border: `1px solid ${tierColor}22`
            }}>
              {c.tier}
            </span>
          </div>
          <div style={{ fontSize: 13, color: '#666', marginTop: '0.15rem' }}>
            {c.title} · {c.years_exp}yr · {c.domain} · {c.location}
          </div>
        </div>

        {/* Score + Chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'var(--mono)', fontSize: '1.3rem', fontWeight: 700,
              color: comp >= 72 ? 'var(--tier1)' : comp >= 50 ? 'var(--tier2)' : '#aaa'
            }}>
              {comp?.toFixed(1)}%
            </div>
            <div style={{ fontSize: 11, color: '#bbb', fontFamily: 'var(--mono)' }}>composite</div>
          </div>
          <div style={{
            color: '#bbb', fontSize: 16, transition: 'transform 0.2s',
            transform: expanded ? 'rotate(180deg)' : 'none'
          }}>▾</div>
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div style={{
          borderTop: '1px solid var(--border)', padding: '1.25rem',
          animation: 'fadeUp 0.3s ease both'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

            {/* Left: Scores */}
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#aaa', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                SCORE BREAKDOWN
              </div>
              <div style={{
                display: 'flex', gap: '1.5rem', marginBottom: '1rem',
                padding: '0.75rem', background: 'var(--cream)', borderRadius: 8
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {c.match_score?.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 11, color: '#888' }}>Match</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {c.interest_score?.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 11, color: '#888' }}>Interest</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold)' }}>
                    {comp?.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: 11, color: '#888' }}>Composite</div>
                </div>
              </div>

              {c.match_breakdown && (
                <>
                  <ScoreBar label="Skill Overlap" value={c.match_breakdown.skill_overlap} weight="0.40" />
                  <ScoreBar label="Experience" value={c.match_breakdown.experience_delta} weight="0.25" />
                  <ScoreBar label="Domain Fit" value={c.match_breakdown.domain_fit} weight="0.20" />
                  <ScoreBar label="Keyword Resonance" value={c.match_breakdown.keyword_resonance} weight="0.15" />
                </>
              )}

              {c.match_breakdown?.exp_note && (
                <div style={{
                  marginTop: '0.5rem', fontFamily: 'var(--mono)', fontSize: 12,
                  color: '#888', padding: '0.4rem 0.75rem', background: 'var(--cream)', borderRadius: 6
                }}>
                  exp note: {c.match_breakdown.exp_note}
                </div>
              )}
            </div>

            {/* Right: Profile + Rationale */}
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#aaa', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                PROFILE
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#444', marginBottom: '0.5rem' }}>
                  {c.bio}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  <span style={{ fontWeight: 500 }}>Education:</span> {c.education}
                </div>
                <div style={{ fontSize: 12, color: '#888' }}>
                  <span style={{ fontWeight: 500 }}>Salary:</span> ₹{c.salary_expectation_lpa}L · Notice: {c.notice_period_days}d · Remote: {c.open_to_remote ? 'Yes' : 'No'}
                </div>
              </div>

              {/* Skills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                {c.skills?.map(s => (
                  <span key={s} style={{
                    fontSize: 11, padding: '0.2rem 0.5rem', borderRadius: 4,
                    background: 'var(--cream)', border: '1px solid var(--border)',
                    fontFamily: 'var(--mono)', color: '#555'
                  }}>{s}</span>
                ))}
              </div>

              {c.match_rationale && (
                <div style={{
                  background: '#fffcf0', border: '1px solid #e8d98a', borderRadius: 8,
                  padding: '0.75rem', fontSize: 13, lineHeight: 1.6, color: '#555'
                }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: '#c8973a', marginBottom: '0.4rem', letterSpacing: '0.06em' }}>
                    AI ASSESSMENT
                  </div>
                  {c.match_rationale}
                </div>
              )}
            </div>
          </div>

          {/* Conversation Log */}
          {c.conversation_log?.length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: '#aaa', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
                OUTREACH CONVERSATION
              </div>
              <div style={{
                background: 'var(--cream)', borderRadius: 8, padding: '1rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem',
                maxHeight: 320, overflowY: 'auto'
              }}>
                {c.conversation_log.map((turn, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{
                        fontSize: 10, background: '#334155', color: 'white',
                        borderRadius: 4, padding: '0.15rem 0.4rem', flexShrink: 0, marginTop: 2,
                        fontFamily: 'var(--mono)'
                      }}>REC</span>
                      <span style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>{turn.recruiter}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start', paddingLeft: '0.5rem' }}>
                      <span style={{
                        fontSize: 10, background: 'var(--sage)', color: 'white',
                        borderRadius: 4, padding: '0.15rem 0.4rem', flexShrink: 0, marginTop: 2,
                        fontFamily: 'var(--mono)'
                      }}>{c.name.split(' ')[0].substring(0, 3).toUpperCase()}</span>
                      <span style={{ fontSize: 13, color: '#333', lineHeight: 1.5, fontStyle: 'italic' }}>{turn.candidate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
