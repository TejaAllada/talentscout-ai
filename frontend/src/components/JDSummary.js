export default function JDSummary({ jd }) {
  const Tag = ({ children, color = 'var(--ink)' }) => (
    <span style={{
      fontSize: 12, padding: '0.2rem 0.6rem', borderRadius: 4,
      background: 'var(--cream)', border: '1px solid var(--border)',
      fontFamily: 'var(--mono)', color, display: 'inline-block', margin: '0.2rem 0.2rem 0.2rem 0'
    }}>
      {children}
    </span>
  );

  const Row = ({ label, children }) => (
    <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: '#888', paddingTop: 2 }}>{label}</div>
      <div>{children}</div>
    </div>
  );

  return (
    <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: '1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>
          PARSED BY LLAMA 3.3 70B
        </div>
        <h3 style={{ fontFamily: 'var(--serif)', fontSize: '1.6rem' }}>{jd.role_title}</h3>
      </div>

      <Row label="Summary">
        <p style={{ fontSize: 14, lineHeight: 1.7, color: '#444' }}>{jd.role_summary}</p>
      </Row>
      <Row label="Domain">
        <span style={{ fontSize: 14, fontWeight: 500 }}>{jd.domain}</span>
      </Row>
      <Row label="Seniority">
        <span style={{ fontSize: 14, fontWeight: 500 }}>{jd.seniority}</span>
      </Row>
      <Row label="Experience">
        <span style={{ fontSize: 14 }}>{jd.min_experience_years}–{jd.max_experience_years || 'open'} years</span>
      </Row>
      <Row label="Required Skills">
        <div>{jd.required_skills?.map(s => <Tag key={s}>{s}</Tag>)}</div>
      </Row>
      {jd.nice_to_have_skills?.length > 0 && (
        <Row label="Nice to Have">
          <div>{jd.nice_to_have_skills.map(s => <Tag key={s} color="#888">{s}</Tag>)}</div>
        </Row>
      )}
      {jd.keywords?.length > 0 && (
        <Row label="Keywords">
          <div>{jd.keywords.map(s => <Tag key={s} color="var(--gold)">{s}</Tag>)}</div>
        </Row>
      )}
      <Row label="Location">
        <span style={{ fontSize: 14 }}>
          {jd.location_preference || '—'}
          {jd.remote_ok && <Tag color="var(--sage)">Remote OK</Tag>}
        </span>
      </Row>
      {jd.salary_range_lpa?.min && (
        <Row label="Salary Range">
          <span style={{ fontSize: 14 }}>
            ₹{jd.salary_range_lpa.min}L – ₹{jd.salary_range_lpa.max || '?'}L
          </span>
        </Row>
      )}
      {jd.soft_skills?.length > 0 && (
        <Row label="Soft Skills">
          <div>{jd.soft_skills.map(s => <Tag key={s}>{s}</Tag>)}</div>
        </Row>
      )}
    </div>
  );
}
