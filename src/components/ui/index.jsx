// ─── Shared UI Components ───────────────────────────────────────────────────

export function PixelCard({ children, className = '', glow = false, style = {} }) {
  return (
    <div
      className={`card ${glow ? 'animate-pulse-green' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function Badge({ children, variant = 'default' }) {
  const styles = {
    default: {},
    success: { borderColor: '#4ade80', color: '#4ade80', background: '#052e16' },
    warning: { borderColor: '#fbbf24', color: '#fbbf24', background: '#451a03' },
    error:   { borderColor: '#f87171', color: '#f87171', background: '#450a0a' },
    info:    { borderColor: '#60a5fa', color: '#60a5fa', background: '#0c1a3e' },
  };
  return <span className="badge" style={styles[variant]}>{children}</span>;
}

export function StatCard({ icon, label, value, sub, color = 'var(--green-bright)' }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 20, color, marginBottom: 4, textShadow: '2px 2px 0 #052e16' }}>
        {value}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
        {label}
      </div>
      {sub && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>{sub}</div>}
    </div>
  );
}

export function Loader({ text = 'Loading...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: 16 }}>
      <div style={{
        width: 40, height: 40,
        border: '4px solid var(--border-green)',
        borderTopColor: 'var(--green-bright)',
        borderRadius: 0,
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--text-secondary)', letterSpacing: 2 }}>
        {text}<span className="animate-blink">█</span>
      </span>
    </div>
  );
}

export function SectionHeader({ title, sub, centered = false }) {
  return (
    <div style={{ marginBottom: 40, textAlign: centered ? 'center' : 'left' }}>
      <h2 style={{
        fontFamily: 'var(--font-pixel)',
        fontSize: 16,
        color: 'var(--green-bright)',
        textShadow: '3px 3px 0 #052e16',
        marginBottom: 10,
        lineHeight: 1.6,
      }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-secondary)', maxWidth: 600, margin: centered ? '0 auto' : 0 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

export function PixelDivider({ label }) {
  return (
    <div className="pixel-divider">
      {label && (
        <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      )}
    </div>
  );
}

export function CreeperIcon({ size = 32 }) {
  const px = size / 8;
  const grid = [
    0,1,1,1,1,1,1,0,
    1,1,1,1,1,1,1,1,
    1,0,0,1,1,0,0,1,
    1,0,0,1,1,0,0,1,
    1,1,1,0,0,1,1,1,
    1,1,0,0,0,0,1,1,
    1,1,0,1,1,0,1,1,
    1,1,0,0,0,0,1,1,
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(8, ${px}px)`, gridTemplateRows: `repeat(8, ${px}px)` }}>
      {grid.map((p, i) => (
        <div key={i} style={{
          width: px, height: px,
          background: p ? 'var(--green-mid)' : 'transparent',
          boxShadow: p ? 'inset -1px -1px 0 rgba(0,0,0,0.4)' : 'none',
        }} />
      ))}
    </div>
  );
}

export function EmptyState({ icon = '📦', title, sub, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 12 }}>{title}</h3>
      {sub && <p style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-muted)', marginBottom: 24 }}>{sub}</p>}
      {action}
    </div>
  );
}

export function ProgressBar({ value, max = 100, color = 'var(--green-bright)', label }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color }}>{value}</span>
        </div>
      )}
      <div style={{ height: 12, background: 'var(--stone)', border: '2px solid var(--border-green)', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          transition: 'width 0.6s ease',
          boxShadow: `inset -3px 0 0 rgba(0,0,0,0.3)`,
        }} />
      </div>
    </div>
  );
}
