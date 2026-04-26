export default function Footer() {
  return (
    <footer style={{
      marginTop: 'auto', borderTop: '1px solid var(--border)',
      padding: '1.5rem 2rem', textAlign: 'center',
      fontFamily: 'var(--mono)', fontSize: 12, color: '#aaa'
    }}>
      TalentScout AI · Catalyst Hackathon 2026 · Built by{' '}
      <strong style={{ color: '#666' }}>Allada Teja Sai Kumar</strong>
      {' '}· Powered by Groq + LLaMA 3.3 70B
    </footer>
  );
}
