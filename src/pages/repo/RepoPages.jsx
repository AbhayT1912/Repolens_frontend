import { useParams, Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { api } from '../../utils/api';

/* ══════════════════════════════════════════════════
   SHARED CSS
══════════════════════════════════════════════════ */
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');

  @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-5px) scale(1.15);}}
  @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
  @keyframes mcFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes actIn{from{opacity:0;transform:translateX(-10px);}to{opacity:1;transform:translateX(0);}}
  @keyframes neonPulse{0%,100%{text-shadow:2px 2px 0 #040d07,0 0 12px rgba(74,222,128,0.3);}50%{text-shadow:2px 2px 0 #040d07,0 0 28px rgba(74,222,128,0.7);}}
  @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
  @keyframes nodePulse{0%,100%{opacity:1;}50%{opacity:0.5;}}
  @keyframes chatSlide{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}

  .pg{position:absolute;inset:0;background-image:linear-gradient(rgba(74,222,128,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.02) 1px,transparent 1px);background-size:34px 34px;pointer-events:none;z-index:0;}
  .scanline{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
  .scanline::after{content:'';position:absolute;left:0;right:0;height:2px;background:rgba(74,222,128,0.04);animation:scanMove 14s linear infinite;}

  .mc-card{background:#0b1e10;border:3px solid #1a4528;position:relative;overflow:hidden;}
  .mc-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(74,222,128,0.03) 0%,transparent 60%);pointer-events:none;}

  .tab-link{padding:10px 18px;font-family:'Press Start 2P',monospace;font-size:7px;letter-spacing:1px;text-decoration:none;transition:all 0.12s;white-space:nowrap;border-bottom:3px solid transparent;margin-bottom:-3px;color:#1a4a2e;background:transparent;}
  .tab-link:hover{color:#4ade80;background:rgba(74,222,128,0.04);}
  .tab-active{color:#4ade80!important;background:#0d2a14!important;border-bottom:3px solid #4ade80!important;}

  .mc-input{width:100%;padding:12px 14px;box-sizing:border-box;background:#020c06;border:2px solid #1a4528;color:#4ade80;font-family:'VT323',monospace;font-size:20px;outline:none;transition:border-color 0.15s,box-shadow 0.15s;}
  .mc-input:focus{border-color:#4ade80;box-shadow:0 0 0 2px rgba(74,222,128,0.15);}
  .mc-input::placeholder{color:#1a4528;}

  .mc-btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:'Press Start 2P',monospace;font-size:8px;letter-spacing:1px;padding:11px 20px;color:#fff;text-decoration:none;cursor:pointer;background:linear-gradient(180deg,#16a34a,#15803d);border:3px solid #22c55e;box-shadow:4px 4px 0 #052e16;transition:all 0.1s;position:relative;overflow:hidden;}
  .mc-btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.1) 0%,transparent 50%);pointer-events:none;}
  .mc-btn-primary:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #052e16;}

  .mc-btn-ghost{display:inline-flex;align-items:center;justify-content:center;gap:6px;font-family:'Press Start 2P',monospace;font-size:8px;letter-spacing:1px;padding:10px 18px;color:#4ade80;text-decoration:none;cursor:pointer;background:transparent;border:3px solid #22c55e;box-shadow:3px 3px 0 #052e16;transition:all 0.1s;}
  .mc-btn-ghost:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #052e16;background:rgba(74,222,128,0.06);}

  .toolbar-btn{font-family:'Press Start 2P',monospace;font-size:6px;letter-spacing:1px;color:#2d6a3f;background:#020c06;border:2px solid #1a4528;padding:7px 12px;cursor:pointer;transition:all 0.12s;}
  .toolbar-btn:hover{border-color:#4ade80;color:#4ade80;}

  .fn-link{display:flex;align-items:center;gap:10px;padding:12px 16px;text-decoration:none;transition:all 0.12s;border-bottom:2px solid #0d2a14;}
  .fn-link:hover{background:#0d2a14;}
  .fn-link:last-child{border-bottom:none;}

  .suggestion-btn{background:#020c06;border:2px solid #1a4528;color:#1a4a2e;font-family:'VT323',monospace;font-size:16px;padding:6px 12px;cursor:pointer;transition:all 0.12s;white-space:nowrap;}
  .suggestion-btn:hover{border-color:#4ade80;color:#4ade80;}

  .tree-row{display:flex;align-items:center;gap:8px;padding:5px 10px;cursor:pointer;font-family:'VT323',monospace;font-size:18px;color:#2d6a3f;transition:all 0.1s;}
  .tree-row:hover{color:#4ade80;background:rgba(74,222,128,0.04);}
`;

/* ══════════════════════════════════════════════════
   PIXEL ATOMS
══════════════════════════════════════════════════ */
function Torch({ style = {} }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF(x => (x + 1) % 3), 110); return () => clearInterval(id); }, []);
  const fc = ['#ff8c00', '#ff5500', '#ffaa00'][f];
  return (
    <div style={{ position: 'relative', width: 10, height: 24, flexShrink: 0, ...style }}>
      <div style={{ position: 'absolute', top: 0, left: 1, width: 8, height: 6, background: fc, boxShadow: `0 0 ${4 + f * 2}px ${fc}`, transition: 'all 0.09s' }} />
      <div style={{ position: 'absolute', top: 5, left: 3, width: 4, height: 12, background: '#8B5E3C' }} />
    </div>
  );
}

function DiamondOre({ size = 30 }) {
  const [ph, setPh] = useState(0);
  useEffect(() => { const id = setInterval(() => setPh(p => (p + 1) % 4), 500); return () => clearInterval(id); }, []);
  const g = ['drop-shadow(0 0 3px #00d4ff)', 'drop-shadow(0 0 7px #00d4ff)', 'drop-shadow(0 0 5px #00eeff)', 'drop-shadow(0 0 3px #00d4ff)'][ph];
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ imageRendering: 'pixelated', filter: g, transition: 'filter 0.4s', flexShrink: 0 }}>
      <rect width="12" height="12" fill="#7a7a7a" /><rect x="1" y="1" width="10" height="10" fill="#8a8a8a" />
      <rect x="2" y="2" width="8" height="8" fill="#7a7a7a" /><rect x="2" y="3" width="2" height="2" fill="#00d4ff" />
      <rect x="7" y="5" width="3" height="2" fill="#00d4ff" /><rect x="4" y="7" width="2" height="2" fill="#00d4ff" />
      <rect x="3" y="3" width="1" height="1" fill="#aaffff" />
    </svg>
  );
}

function XPOrbs({ count = 8, style = {} }) {
  return (
    <div style={{ display: 'flex', gap: 4, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#a3e635', boxShadow: '0 0 5px #a3e635', animation: `xpBounce 1.4s ${i * 0.1}s ease-in-out infinite`, opacity: 1 - i * 0.09 }} />
      ))}
    </div>
  );
}

function SegBar({ pct, color, segments = 16 }) {
  const filled = Math.round((pct / 100) * segments);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 7, background: i < filled ? color : '#0d2a14', boxShadow: i < filled ? `0 0 4px ${color}66` : 'none' }} />
      ))}
    </div>
  );
}

function McBadge({ children, color = '#4ade80', style = {} }) {
  return (
    <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color, border: `2px solid ${color}55`, padding: '3px 8px', background: `${color}11`, display: 'inline-block', letterSpacing: 1, whiteSpace: 'nowrap', ...style }}>
      {children}
    </span>
  );
}

function CornerPip({ color = '#22c55e', pos = 'tr' }) {
  const p = { tl: { top: -4, left: -4 }, tr: { top: -4, right: -4 }, bl: { bottom: -4, left: -4 }, br: { bottom: -4, right: -4 } }[pos];
  return <div style={{ position: 'absolute', width: 12, height: 12, background: color, boxShadow: `0 0 7px ${color}99`, ...p }} />;
}

function SectionLabel({ title, sub, right }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, position: 'relative', zIndex: 1 }}>
      <div>
        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', letterSpacing: 2, marginBottom: sub ? 5 : 0 }}>▸ {title}</div>
        {sub && <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#1a4a2e' }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

function MiniStat({ icon, label, value, sub, color = '#4ade80', delay = 0 }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="mc-card"
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ padding: '18px 16px', boxShadow: hov ? `5px 5px 0 #040d07, 0 0 20px ${color}33` : '3px 3px 0 #040d07', border: `3px solid ${hov ? color : '#1a4528'}`, transform: hov ? 'translate(-2px,-2px)' : 'none', transition: 'all 0.18s', animation: `fadeUp 0.4s ${delay}s ease both` }}
    >
      <CornerPip color={color} />
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${color}06 0%,transparent 55%)`, pointerEvents: 'none' }} />
      <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 16, color, textShadow: '2px 2px 0 #040d07', marginBottom: 4 }}>{value}</div>
      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#2d6a3f', letterSpacing: 1, marginBottom: sub ? 6 : 0 }}>{label}</div>
      {sub && <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#1a4a2e' }}>{sub}</div>}
      <div style={{ marginTop: 10 }}><SegBar pct={typeof value === 'string' ? (parseInt(value) % 100) || 70 : value} color={color} segments={10} /></div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ marginTop: 100, textAlign: 'center', fontFamily: "'VT323',monospace", fontSize: 24, color: '#4ade80' }}>
      <div style={{ marginBottom: 20, animation: 'neonPulse 1.5s ease-in-out infinite' }}>[ ANALYZING REPOSITORY... ]</div>
      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#1a4a2e', marginBottom: 20 }}>THIS_MAY_TAKE_A_MOMENT</div>
      <div style={{ width: 200, height: 4, background: '#0b1e10', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '40%', background: '#4ade80', animation: 'scanMove 2s linear infinite' }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   TAB BAR
══════════════════════════════════════════════════ */
function RepoTabBar({ repoId }) {
  const tabs = [
    { to: `/${repoId}`,           label: '📦 Overview',   end: true },
    { to: `/${repoId}/structure`, label: '🗂 Structure'             },
    { to: `/${repoId}/graph`,     label: '🕸 Call Graph'            },
    { to: `/${repoId}/analytics`, label: '📊 Analytics'             },
    { to: `/${repoId}/ask`,       label: '💬 Ask AI'                },
    { to: `/${repoId}/history`,   label: '🕐 History'               },
  ];
  return (
    <div style={{ display: 'flex', borderBottom: '3px solid #22c55e', marginBottom: 28, gap: 0, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
      <Torch style={{ alignSelf: 'center', marginRight: 6 }} />
      {tabs.map(({ to, label, end }) => (
        <NavLink key={to} to={to} end={end}
          className={({ isActive }) => `tab-link${isActive ? ' tab-active' : ''}`}
        >
          {label}
        </NavLink>
      ))}
      <Torch style={{ alignSelf: 'center', marginLeft: 6 }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   PAGE WRAPPER
══════════════════════════════════════════════════ */
function Page({ children }) {
  return (
    <>
      <style>{SHARED_CSS}</style>
      <div style={{ background: '#040d07', minHeight: '100%', padding: 'clamp(14px,3vw,28px)', position: 'relative', animation: 'fadeUp 0.4s ease both' }}>
        <div className="pg" /><div className="scanline" />
        {children}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   REPO OVERVIEW
══════════════════════════════════════════════════ */
const MODULES = [
  { name: 'src/core',        files: 24,  functions: 187, complexity: 'high'   },
  { name: 'src/components',  files: 52,  functions: 310, complexity: 'medium' },
  { name: 'src/utils',       files: 18,  functions: 89,  complexity: 'low'    },
  { name: 'src/hooks',       files: 12,  functions: 44,  complexity: 'low'    },
  { name: 'src/api',         files: 8,   functions: 62,  complexity: 'medium' },
];
const COMPLEX_COLOR = { high: '#f87171', medium: '#fbbf24', low: '#4ade80' };

export function RepoOverview() {
  const { repoId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let pollInterval;
    
    async function fetchReport() {
      try {
        const response = await api.get(`/${repoId}/report`);
        if (response.success && response.data) {
          setReport(response.data);
          setLoading(false);
          setError(null);
          if (pollInterval) clearInterval(pollInterval);
        } else if (response.message === "Report not generated yet" || !response.success) {
          // Report not ready, keep loading and wait for next poll
          setLoading(true);
        }
      } catch (err) {
        // If it's a 404, the backend hasn't saved the report yet (processing)
        if (err.status === 404) {
          setLoading(true);
          setError(null);
          // Keep polling...
        } else {
          setError(err.message);
          setLoading(false);
          if (pollInterval) clearInterval(pollInterval);
        }
      }
    }

    fetchReport();
    pollInterval = setInterval(fetchReport, 3000);

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [repoId]);

  const handleDownloadPdf = async () => {
    try {
      await api.download(`/${repoId}/report/pdf`, `repo-${repoId}-report.pdf`);
    } catch (err) {
      setError(err.message || 'Failed to download PDF report.');
    }
  };

  if (loading && !report) {
    return (
      <Page>
        <RepoTabBar repoId={repoId} />
        <LoadingSkeleton />
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <RepoTabBar repoId={repoId} />
        <div style={{ padding: 40, border: '4px solid #ef4444', background: 'rgba(239,68,68,0.05)', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>💀</div>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#f87171', marginBottom: 16 }}>ANALYSIS_FAILED.ERR</div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#ef4444' }}>{error}</div>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: 24, padding: '10px 20px', background: '#ef4444', border: 'none', color: '#fff', cursor: 'pointer', fontFamily: "'Press Start 2P',monospace", fontSize: 8 }}
          >
            RETRY_ACCESS
          </button>
        </div>
      </Page>
    );
  }

  const overviewStats = report || {};
  const modules = report?.modules || [];

  return (
    <Page>
      <RepoTabBar repoId={repoId} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12, border: '2px solid #22c55e', padding: '4px 14px', fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#4ade80', letterSpacing: 2, background: 'rgba(21,128,61,0.12)', boxShadow: '3px 3px 0 #040d07' }}>
            <span style={{ animation: 'xpBounce 1s ease-in-out infinite' }}>✦</span> REPOSITORY <span style={{ animation: 'xpBounce 1s 0.5s ease-in-out infinite' }}>✦</span>
          </div>
          <h1 style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 'clamp(10px,1.5vw,15px)', color: '#4ade80', animation: 'neonPulse 3s ease-in-out infinite', lineHeight: 1.7, marginBottom: 12 }}>
            {repoId?.replace(/-/g, '/')}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <McBadge color="#4ade80">✓ ANALYZED</McBadge>
            <McBadge color="#60a5fa">TYPESCRIPT</McBadge>
            <McBadge color="#fbbf24">MIT LICENSE</McBadge>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleDownloadPdf} className="mc-btn-ghost" style={{ fontSize: 8, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <span>📄</span> Export PDF
          </button>
          <Link to={`/${repoId}/ask`} className="mc-btn-primary" style={{ fontSize: 8 }}>💬 Ask AI</Link>
          <Link to={`/${repoId}/graph`} className="mc-btn-ghost" style={{ fontSize: 8 }}>🕸 View Graph</Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '🗂', label: 'Total Files',  value: overviewStats.total_files?.toLocaleString() || '0', sub: 'across all dirs',   color: '#4ade80', delay: 0.05 },
          { icon: '⚡', label: 'Functions',     value: overviewStats.total_functions?.toLocaleString() || '0', sub: 'parsed & indexed',  color: '#fbbf24', delay: 0.12 },
          { icon: '📝', label: 'Lines of Code', value: overviewStats.total_lines_of_code > 1000 ? `${(overviewStats.total_lines_of_code / 1000).toFixed(1)}k` : overviewStats.total_lines_of_code || '0', sub: 'excl. comments',    color: '#60a5fa', delay: 0.19 },
          { icon: '🔗', label: 'Dependencies',  value: overviewStats.total_dependencies || '0',    sub: 'direct & transitive', color: '#a78bfa', delay: 0.26 },
        ].map(s => <MiniStat key={s.label} {...s} />)}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, position: 'relative', zIndex: 1 }}>
        <div style={{ animation: 'fadeUp 0.4s 0.32s ease both' }}>
          <SectionLabel title="TOP MODULES" sub="Detected structure and entry points" right={<DiamondOre />} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {modules.map((mod, i) => {
              const complexity = mod.complexity || 'low';
              const cc = COMPLEX_COLOR[complexity];
              return (
                <div key={i} className="mc-card"
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 16px', boxShadow: '3px 3px 0 #040d07', transition: 'all 0.15s', animation: `fadeUp 0.35s ${0.34 + i * 0.06}s ease both` }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = cc; e.currentTarget.style.transform = 'translate(-2px,-2px)'; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.transform = ''; }}
                >
                  <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: cc }} />
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#86efac', flex: 1, marginLeft: 10 }}>{mod.name}</div>
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#1a4a2e' }}>{mod.files_count || 0} files</span>
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#1a4a2e' }}>{mod.type || 'module'}</span>
                  <McBadge color={cc}>● {complexity}</McBadge>
                </div>
              );
            })}
            {modules.length === 0 && (
              <div className="mc-card" style={{ padding: 20, textAlign: 'center', color: '#1a4a2e', fontFamily: "'VT323',monospace", fontSize: 18 }}>
                No significant modules detected.
              </div>
            )}
          </div>
          <XPOrbs count={8} style={{ marginTop: 16 }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'fadeUp 0.4s 0.38s ease both' }}>
          <div>
            <SectionLabel title="QUICK SUMMARY" />
            <div className="mc-card" style={{ padding: '22px', boxShadow: '4px 4px 0 #040d07' }}>
              <CornerPip color="#a78bfa" />
              <p style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#2d6a3f', lineHeight: 1.7, margin: 0 }}>
                {report.architecture_summary || 'No architectural summary available for this repository.'}
              </p>
            </div>
          </div>
          <div>
            <SectionLabel title="RECENT ACCESS" />
            <div className="mc-card" style={{ padding: 0, boxShadow: '3px 3px 0 #040d07' }}>
              {['Search', 'Structure', 'Analytics', 'History'].map((fn, i) => (
                <Link key={i} to={`/${repoId}/${fn.toLowerCase()}`} className="fn-link" style={{ animation: `actIn 0.3s ${0.44 + i * 0.06}s ease both` }}>
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#22c55e' }}>✦</span>
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: '#2d6a3f', flex: 1 }}>{fn}</span>
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#1a4528' }}>→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   FILE STRUCTURE UTILS
   ══════════════════════════════════════════════════ */
function buildFileTree(files) {
  const root = [];
  const map = { '': { children: root } };

  files.forEach(file => {
    const parts = file.path.split('/');
    let currentPath = '';

    parts.forEach((part, i) => {
      const parentPath = currentPath;
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!map[currentPath]) {
        const item = {
          name: part,
          type: i === parts.length - 1 ? 'file' : 'dir',
          path: currentPath
        };
        if (item.type === 'file') {
          item.size = file.size;
          item.language = file.language;
          item.fileId = file.id;
        } else {
          item.children = [];
        }
        map[parentPath].children.push(item);
        map[currentPath] = item;
      }
    });
  });

  return root;
}

/* ══════════════════════════════════════════════════
   FILE STRUCTURE COMPONENTS
   ══════════════════════════════════════════════════ */
function TreeNode({ name, type, children, size, depth = 0, selectedFile, onSelect, path }) {
  const [open, setOpen] = useState(depth < 1);
  const isDir = type === 'dir';
  const isSel = selectedFile === path;
  
  const formatSize = (bytes) => {
    if (!bytes) return '0B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  return (
    <div style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
      <div className="tree-row"
        style={{ borderLeft: depth > 0 ? '2px dashed #1a4528' : 'none', color: isSel ? '#4ade80' : isDir ? '#86efac' : '#2d6a3f', background: isSel ? '#0d2a14' : 'transparent' }}
        onClick={() => isDir ? setOpen(!open) : onSelect?.(path, size)}
      >
        <span>{isDir ? (open ? '📂' : '📁') : '📄'}</span>
        <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
        {!isDir && size && <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: '#1a4a2e', marginLeft: 8 }}>{formatSize(size)}</span>}
      </div>
      {isDir && open && children?.map((c, i) => <TreeNode key={i} {...c} depth={depth + 1} selectedFile={selectedFile} onSelect={onSelect} />)}
    </div>
  );
}

export function RepoStructure() {
  const { repoId } = useParams();
  const [search, setSearch] = useState('');
  const [selFile, setSelFile] = useState(null);
  const [selSize, setSelSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [impact, setImpact] = useState(null);
  const [impactLoading, setImpactLoading] = useState(false);
  const [error, setError] = useState(null);
  const [structure, setStructure] = useState({ files: [], functions: [] });
  const [tree, setTree] = useState([]);

  useEffect(() => {
    let active = true;
    const fetchStructure = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/${repoId}/structure`);
        if (active && res.success) {
          const data = res.data || res;
          setStructure(data);
          setTree(buildFileTree(data.files || []));
          setError(null);
        }
      } catch (err) {
        if (active) setError('Failed to load repository structure.');
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchStructure();
    return () => { active = false; };
  }, [repoId]);

  const handleSelectFile = async (path, size) => {
    setSelFile(path);
    setSelSize(size);
    setImpact(null);

    const fileObj = structure.files?.find(f => f.path === path);
    if (fileObj?.id || fileObj?._id) {
      const fId = fileObj.id || fileObj._id;
      try {
        setImpactLoading(true);
        const res = await api.get(`/${repoId}/impact/${fId}`);
        if (res.success) setImpact(res.data);
      } catch (err) {
        console.error("Impact calculation failed:", err);
      } finally {
        setImpactLoading(false);
      }
    }
  };

  if (loading) return (
    <Page>
      <RepoTabBar repoId={repoId} />
      <LoadingSkeleton />
    </Page>
  );

  if (error) return (
    <Page>
      <RepoTabBar repoId={repoId} />
      <div className="mc-card" style={{ padding: 40, textAlign: 'center', borderColor: '#ef4444' }}>
        <p style={{ color: '#ef4444', fontFamily: "'VT323',monospace", fontSize: 20 }}>{error}</p>
        <button className="mc-btn-primary" onClick={() => window.location.reload()}>Retry Fetch</button>
      </div>
    </Page>
  );

  return (
    <Page>
      <RepoTabBar repoId={repoId} />
      <SectionLabel title="FILE STRUCTURE" sub={`Complete directory tree for ${repoId}`} right={<DiamondOre />} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22, position: 'relative', zIndex: 1 }}>
        <div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="mc-input" style={{ marginBottom: 12 }} />
          <div className="mc-card" style={{ padding: '6px 0', height: '68vh', overflowY: 'auto', boxShadow: '4px 4px 0 #040d07' }}>
            {tree.length > 0 ? (
              tree.map((n, i) => <TreeNode key={i} {...n} selectedFile={selFile} onSelect={handleSelectFile} />)
            ) : (
              <div style={{ padding: 20, textAlign: 'center', color: '#1a4a2e', fontFamily: "'VT323',monospace" }}>No files found.</div>
            )}
          </div>
        </div>
        <div>
          <div className="mc-card" style={{ padding: '22px', minHeight: '400px', marginBottom: 14, boxShadow: '4px 4px 0 #040d07' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', letterSpacing: 1 }}>FILE SYMBOLS</div>
              {selFile && <McBadge color="#60a5fa">{structure.functions.filter(f => {
                const fItem = structure.files.find(file => file.id === f.file_id);
                return fItem?.path === selFile;
              }).length} Symbols</McBadge>}
            </div>
            {selFile ? (
              <>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', marginBottom: 12, wordBreak: 'break-all' }}>{selFile}</div>
                <div style={{ background: '#020c06', border: '2px solid #1a4528', padding: '14px', maxHeight: '50vh', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {structure.functions.filter(f => {
                      const fItem = structure.files.find(file => file.id === f.file_id);
                      return fItem?.path === selFile;
                    }).map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: "'VT323',monospace", fontSize: 18, color: '#86efac' }}>
                        <span style={{ color: '#fbbf24' }}>λ</span>
                        <span>{f.name}</span>
                        <span style={{ color: '#1a4a2e', fontSize: 14 }}>L{f.start_line}-{f.end_line}</span>
                      </div>
                    ))}
                    {structure.functions.filter(f => {
                      const fItem = structure.files.find(file => file.id === f.file_id);
                      return fItem?.path === selFile;
                    }).length === 0 && (
                      <div style={{ color: '#1a4a2e', fontStyle: 'italic', fontSize: 16 }}>No functions detected in this file.</div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 0' }}>
                <div style={{ fontSize: 40, marginBottom: 12, animation: 'mcFloat 2s ease-in-out infinite' }}>📄</div>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#1a4a2e', lineHeight: 1.9 }}>
                  Select a file to view symbols<span style={{ animation: 'mcBlink 0.9s step-end infinite', color: '#4ade80', marginLeft: 4 }}>█</span>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 12 }}>
              <MiniStat icon="🗂" label="Indexed Files" value={structure.file_count || '0'} color="#4ade80" />
              <MiniStat icon="⚡" label="Total Symbols" value={structure.function_count || '0'} color="#fbbf24" />
            </div>

            {/* Impact Analysis Details */}
            {impactLoading ? (
              <div className="mc-card" style={{ padding: 16, border: '1px dashed #fbbf24', textAlign: 'center' }}>
                <div style={{ animation: 'pulsate 1.5s infinite', fontSize: 10, fontFamily: "'Press Start 2P',monospace", color: '#fbbf24' }}>CALCULATING IMPACT...</div>
              </div>
            ) : impact ? (
              <div className="mc-card" style={{ padding: '16px 20px', background: 'rgba(26,74,46,0.1)', border: '2px solid #1a4a2e' }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#fbbf24', marginBottom: 16, letterSpacing: 1 }}>▸ IMPACT ANALYSIS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14 }}>
                  {[
                    { label: 'BLAST RADIUS', value: impact.metrics?.impact_count, color: '#f87171' },
                    { label: 'IMPACT DEPTH', value: impact.metrics?.impact_depth, color: '#60a5fa' },
                    { label: 'FAN-OUT',      value: impact.metrics?.fan_out,      color: '#fbbf24' },
                    { label: 'SEVERITY',      value: impact.metrics?.severity_score, color: '#ef4444' }
                  ].map(m => (
                    <div key={m.label}>
                      <div style={{ fontSize: 7, color: '#1a4a2e', marginBottom: 4, fontFamily: "'Press Start 2P',monospace" }}>{m.label}</div>
                      <div style={{ fontSize: 22, fontFamily: "'Press Start 2P',monospace", color: m.color }}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : selFile ? (
              <div className="mc-card" style={{ padding: 16, border: '1px dashed #1a4a2e', textAlign: 'center', opacity: 0.7 }}>
                <div style={{ fontSize: 14, fontFamily: "'VT323',monospace", color: '#1a4a2e' }}>Impact analysis calculated for this file...</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <XPOrbs count={8} style={{ marginTop: 18, position: 'relative', zIndex: 1 }} />
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   CALL GRAPH
══════════════════════════════════════════════════ */

export function RepoGraph() {
  const { repoId } = useParams();
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    let active = true;
    async function fetchGraph() {
      try {
        setLoading(true);
        const res = await api.get(`/${repoId}/graph`);
        if (active && res.success) {
          const data = res.data || res;
          // Apply a simple circular layout since we don't have X/Y from backend
          const nodes = (data.nodes || []).map((n, i, arr) => {
            const angle = (i / arr.length) * 2 * Math.PI;
            const radius = 35; // centered in 100x100 view
            return {
              ...n,
              x: 50 + radius * Math.cos(angle),
              y: 50 + radius * Math.sin(angle),
              color: n.is_entry ? '#a78bfa' : n.is_dead ? '#1a4a2e' : '#4ade80',
              size: n.is_entry ? 18 : 14
            };
          });
          const edges = (data.edges || []).map(e => {
            if (Array.isArray(e)) return e;
            return [e.from || e.source || e.caller, e.to || e.target || e.callee];
          });
          setGraphData({ nodes, edges });
          setError(null);
        }
      } catch (err) {
        if (active) setError("Failed to load call graph.");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchGraph();
    return () => { active = false; };
  }, [repoId]);

  const selNode = graphData.nodes.find(n => n.id === selected);
  const callers = selected ? graphData.edges.filter(([,b]) => b === selected).map(([a]) => a) : [];
  const callees = selected ? graphData.edges.filter(([a]) => a === selected).map(([,b]) => b) : [];

  if (loading) return (
    <Page>
      <RepoTabBar repoId={repoId} />
      <LoadingSkeleton />
    </Page>
  );

  if (error) return (
    <Page>
      <RepoTabBar repoId={repoId} />
      <div className="mc-card" style={{ padding: 40, textAlign: 'center', borderColor: '#ef4444' }}>
        <p style={{ color: '#ef4444', fontFamily: "'VT323',monospace", fontSize: 20 }}>{error}</p>
        <button className="mc-btn-primary" onClick={() => window.location.reload()}>Retry Fetch</button>
      </div>
    </Page>
  );

  return (
    <Page>
      <RepoTabBar repoId={repoId} />
      <SectionLabel title="CALL GRAPH" sub="Interactive visualization of function call relationships" right={<DiamondOre />} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 22, position: 'relative', zIndex: 1 }}>
        <div className="mc-card" style={{ padding: 0, boxShadow: '6px 6px 0 #040d07' }}>
          <div style={{ padding: '10px 16px', borderBottom: '3px solid #1a4528', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {[['+ Zoom In', () => setZoom(z => Math.min(z+0.2,2.6))],['- Zoom Out', () => setZoom(z => Math.max(z-0.2,0.4))],['↺ Reset', () => { setZoom(1); setSelected(null); }],['↗ Export', () => {}]].map(([l,a]) => (
              <button key={l} className="toolbar-btn" onClick={a}>{l}</button>
            ))}
            <div style={{ marginLeft: 'auto', fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e' }}>{Math.round(zoom*100)}% · {graphData.nodes.length} nodes</div>
          </div>
          <div style={{ overflow: 'hidden', background: '#020c06' }}>
            <svg width="100%" viewBox="0 0 100 100" style={{ height: 500, display: 'block', transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.2s' }}>
              <defs><pattern id="mcgrid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="#0d2a14" strokeWidth="0.4"/></pattern></defs>
              <rect width="100" height="100" fill="url(#mcgrid)" />
              {graphData.edges.map(([a,b],i) => { 
                const na=graphData.nodes.find(n=>n.id===a),
                      nb=graphData.nodes.find(n=>n.id===b),
                      lit=selected&&(a===selected||b===selected); 
                if (!na || !nb) return null;
                return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} stroke={lit?'#22c55e':'#1a4528'} strokeWidth={lit?1:0.5} strokeDasharray={lit?'none':'2 1'} opacity={lit?0.9:0.5} style={{transition:'all 0.2s'}}/>; 
              })}
              {graphData.nodes.map(({ id, x, y, label, color, size, is_entry, is_dead }) => {
                const isSel=selected===id, isCaller=callers.includes(id), isCallee=callees.includes(id);
                return (
                  <g key={id} onClick={() => setSelected(id===selected?null:id)} style={{ cursor: 'pointer' }}>
                    {(isSel||isCaller||isCallee) && <rect x={x-size/2-2} y={y-size/2-2} width={size+4} height={size+4} fill="none" stroke={isSel?color:isCaller?'#60a5fa':'#4ade80'} strokeWidth={1.5} opacity={0.5} style={{animation:'nodePulse 1.5s ease-in-out infinite'}}/>}
                    <rect x={x-size/2} y={y-size/2} width={size} height={size} fill={isSel?`${color}22`:'#020c06'} stroke={color} strokeWidth={isSel?1.8:0.8} style={{transition:'all 0.15s'}}/>
                    <rect x={x-size/2} y={y-size/2} width={3} height={3} fill={color} opacity={0.7}/>
                    <text x={x} y={y+size/2+4} textAnchor="middle" fontSize="3.2" fill={color} fontFamily="monospace">{label.length>13?label.slice(0,11)+'…':label}</text>
                    {is_entry && <circle cx={x+size/2} cy={y-size/2} r="1.5" fill="#a78bfa" style={{animation:'neonPulse 1s infinite'}} />}
                  </g>
                );
              })}
            </svg>
          </div>
          <div style={{ padding: '7px 16px', borderTop: '2px solid #0d2a14', fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: '#1a4a2e', display: 'flex', justifyContent: 'space-between' }}>
            <span>Click a node to inspect</span><span>Drag to pan · scroll to zoom</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {selNode ? (
            <div className="mc-card" style={{ padding: '22px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.3s ease both' }}>
              <CornerPip color={selNode.color} />
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: selNode.color, marginBottom: 10, letterSpacing: 1 }}>{selNode.is_dead ? 'DEAD CODE' : 'SELECTED'}</div>
              <div style={{ fontFamily: "'VT323',monospace", fontSize: 22, color: '#86efac', marginBottom: 16 }}>ƒ {selNode.label}</div>
              <Link to={`/${repoId}/function/${selNode.id}`} className="mc-btn-primary" style={{ fontSize: 6, padding: '9px 12px', display: 'block', textAlign: 'center', marginBottom: 20, textDecoration: 'none' }}>View Full Detail →</Link>
              {callers.length > 0 && <div style={{ marginBottom: 16 }}><div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#60a5fa', marginBottom: 8, letterSpacing: 1 }}>← CALLED BY</div>{callers.map(c => <div key={c} style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#60a5fa', marginBottom: 6 }}>← {c}</div>)}</div>}
              {callees.length > 0 && <div><div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#4ade80', marginBottom: 8, letterSpacing: 1 }}>→ CALLS INTO</div>{callees.map(c => <div key={c} style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#4ade80', marginBottom: 6 }}>→ {c}</div>)}</div>}
              <XPOrbs count={5} style={{ marginTop: 18 }} />
            </div>
          ) : (
            <div className="mc-card" style={{ padding: '40px 20px', textAlign: 'center', boxShadow: '4px 4px 0 #040d07' }}>
              <div style={{ fontSize: 44, marginBottom: 16, animation: 'mcFloat 2.5s ease-in-out infinite' }}>🕸</div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#1a4a2e', lineHeight: 1.9 }}>Click any node<br/>to inspect it<span style={{ animation: 'mcBlink 0.9s step-end infinite', color: '#4ade80', marginLeft: 4 }}>█</span></div>
            </div>
          )}
          <div className="mc-card" style={{ padding: '16px', boxShadow: '3px 3px 0 #040d07' }}>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', marginBottom: 10, letterSpacing: 1 }}>LEGEND</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: '30vh', overflowY: 'auto' }}>
              {graphData.nodes.slice(0, 15).map(({ id, label, color }) => (
                <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }} onClick={() => setSelected(id===selected?null:id)}>
                  <div style={{ width: 10, height: 10, background: color, boxShadow: `0 0 4px ${color}88`, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: selected===id?color:'#2d6a3f' }}>{label}</span>
                </div>
              ))}
              {graphData.nodes.length > 15 && <div style={{ fontSize: 14, color: '#1a4a2e', fontFamily: "'VT323',monospace", marginLeft: 4 }}>+ {graphData.nodes.length - 15} more</div>}
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   FUNCTION DETAIL
══════════════════════════════════════════════════ */
export function FunctionDetail() {
  const { repoId, functionId } = useParams();
  return (
    <Page>
      <div style={{ marginBottom: 18, position: 'relative', zIndex: 1 }}>
        <Link to={`/${repoId}/graph`} className="mc-btn-ghost" style={{ fontSize: 7 }}>← Back to Graph</Link>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, position: 'relative', zIndex: 1 }}>
        <div>
          {/* Header */}
          <div className="mc-card" style={{ padding: '24px', marginBottom: 16, boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.05s ease both' }}>
            <CornerPip color="#4ade80" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', marginBottom: 10, letterSpacing: 1 }}>FUNCTION</div>
            <h1 style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 'clamp(10px,1.5vw,14px)', color: '#4ade80', animation: 'neonPulse 3s ease-in-out infinite', lineHeight: 1.6, marginBottom: 14 }}>ƒ {functionId}</h1>
            <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e', marginBottom: 14 }}>📄 src/core/renderer.ts · Line 142</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <McBadge color="#4ade80">✓ ANALYZED</McBadge>
              <McBadge color="#60a5fa">TYPESCRIPT</McBadge>
              <McBadge color="#fbbf24">EXPORTED</McBadge>
              <McBadge color="#f87171">HIGH COMPLEXITY</McBadge>
            </div>
          </div>

          {/* Source */}
          <div className="mc-card" style={{ padding: '22px', marginBottom: 16, boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.12s ease both' }}>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', marginBottom: 14, letterSpacing: 1 }}>▸ SOURCE CODE</div>
            <div style={{ background: '#020c06', border: '2px solid #1a4528', padding: '16px', overflowX: 'auto' }}>
              <pre style={{ margin: 0, fontSize: 12, lineHeight: 1.7, color: '#2d6a3f', fontFamily: 'monospace' }}>{`export function ${functionId}(\n  element: ReactElement,\n  container: DOMContainer,\n  callback?: () => void\n): void {\n  invariant(\n    isValidContainer(container),\n    'Target container is not a DOM element.'\n  );\n  return legacyRenderSubtreeIntoContainer(\n    null, element, container,\n    false, callback,\n  );\n}`}</pre>
            </div>
          </div>

          {/* AI */}
          <div className="mc-card" style={{ padding: '22px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.2s ease both' }}>
            <CornerPip color="#a78bfa" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#a78bfa', marginBottom: 14, letterSpacing: 1 }}>🤖 AI EXPLANATION</div>
            <p style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: '#2d6a3f', lineHeight: 1.7 }}>
              Primary entry point for rendering into a DOM container. Validates the target, then delegates to{' '}
              <code style={{ color: '#4ade80', background: '#020c06', padding: '1px 6px', fontFamily: 'monospace', fontSize: 12 }}>legacyRenderSubtreeIntoContainer</code>{' '}
              which handles fiber tree creation and mounting.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="mc-card" style={{ padding: '20px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.08s ease both' }}>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', marginBottom: 14, letterSpacing: 1 }}>▸ METRICS</div>
            {[['Complexity','14','#f87171'],['Lines','22','#4ade80'],['Callers','8','#60a5fa'],['Callees','3','#a78bfa']].map(([k,v,c]) => (
              <div key={k} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e' }}>{k}</span>
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 10, color: c }}>{v}</span>
                </div>
                <SegBar pct={parseInt(v)*7} color={c} segments={12} />
              </div>
            ))}
          </div>
          <div className="mc-card" style={{ padding: '20px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.14s ease both' }}>
            <CornerPip color="#60a5fa" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#60a5fa', marginBottom: 12, letterSpacing: 1 }}>← CALLED BY</div>
            {['ReactDOM.render','hydrate','createRoot'].map(fn => (
              <div key={fn} style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#60a5fa', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7 }}>←</span> {fn}
              </div>
            ))}
          </div>
          <div className="mc-card" style={{ padding: '20px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.2s ease both' }}>
            <CornerPip color="#4ade80" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#4ade80', marginBottom: 12, letterSpacing: 1 }}>→ CALLS INTO</div>
            {['isValidContainer','invariant','legacyRenderSubtreeIntoContainer'].map(fn => (
              <Link key={fn} to={`/${repoId}/function/${fn}`} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, textDecoration: 'none' }}
                onMouseOver={e => e.currentTarget.querySelector('span:last-child').style.color='#86efac'}
                onMouseOut={e => e.currentTarget.querySelector('span:last-child').style.color='#4ade80'}
              >
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#4ade80' }}>→</span>
                <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#4ade80', transition: 'color 0.12s' }}>{fn}</span>
              </Link>
            ))}
          </div>
          <XPOrbs count={6} />
        </div>
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   ANALYTICS
══════════════════════════════════════════════════ */
const LANGS = [
  { name: 'TypeScript', pct: 68, color: '#60a5fa' },
  { name: 'JavaScript', pct: 22, color: '#fbbf24' },
  { name: 'CSS',        pct: 6,  color: '#a78bfa' },
  { name: 'Other',      pct: 4,  color: '#6b7280' },
];
const HOTSPOTS = [
  { file: 'src/core/reconciler.ts',  complexity: 94, changes: 342 },
  { file: 'src/core/renderer.ts',    complexity: 87, changes: 218 },
  { file: 'src/fiber/workLoop.ts',   complexity: 81, changes: 195 },
  { file: 'src/hooks/useState.ts',   complexity: 62, changes: 156 },
  { file: 'src/scheduler/index.ts',  complexity: 58, changes: 134 },
];

export function RepoAnalytics() {
  const { repoId } = useParams();
  const [report, setReport] = useState(null);
  const [health, setHealth] = useState(null);
  const [layers, setLayers] = useState(null);
  const [risks, setRisks] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    async function fetchData() {
      try {
        setLoading(true);
        const [reportRes, healthRes, riskRes, structureRes, layerRes] = await Promise.all([
          api.get(`/${repoId}/report`),
          api.get(`/${repoId}/file-graph`),
          api.get(`/${repoId}/risk-ranking`),
          api.get(`/${repoId}/structure`),
          api.get(`/${repoId}/layer-analysis`)
        ]);

        if (active) {
          if (reportRes.success) setReport(reportRes.data);
          if (healthRes.success) setHealth(healthRes.data);
          if (riskRes.success) setRisks(riskRes.data);
          if (structureRes.success) setFiles(structureRes.data.files || structureRes.data || []);
          if (layerRes.success) setLayers(layerRes.data);
          setError(null);
        }
      } catch (err) {
        if (active) setError("Failed to load analytics data.");
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchData();
    return () => { active = false; };
  }, [repoId]);

  if (loading) return <Page><RepoTabBar repoId={repoId} /><LoadingSkeleton /></Page>;
  if (error) return (
    <Page>
      <RepoTabBar repoId={repoId} />
      <div className="mc-card" style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>{error}</div>
    </Page>
  );

  const deadPct = report ? (report.dead_functions_count / report.total_functions * 100).toFixed(1) : '0';

  return (
    <Page>
      <RepoTabBar repoId={repoId} />
      <SectionLabel title="ANALYTICS" sub="Code health, complexity, and contributor insights" right={<DiamondOre />} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { icon: '📁', label: 'Total Files',     value: report?.total_files || '0', sub: 'indexable files',   color: '#60a5fa', delay: 0.05 },
          { icon: '🏆', label: 'Health Score',    value: health?.architecture_health_score || '0', sub: 'out of 100',  color: '#4ade80', delay: 0.12 },
          { icon: '💎', label: 'Discipline',      value: layers?.architecture_discipline_score || '0', sub: 'layer adherence', color: '#fbbf24', delay: 0.15 },
          { icon: '⚙️', label: 'Functions',       value: report?.total_functions || '0', sub: 'total symbols',  color: '#fbbf24', delay: 0.19 },
          { icon: '📝', label: 'Dependencies',    value: health?.total_dependencies || '0',  sub: 'detected imports', color: '#a78bfa', delay: 0.26 },
        ].map(s => <MiniStat key={s.label} {...s} />)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 22 }}>
        {/* Architecture Summary */}
        <div className="mc-card" style={{ padding: '24px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.32s ease both' }}>
          <CornerPip color="#22c55e" />
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', marginBottom: 18, letterSpacing: 1 }}>▸ ARCHITECTURE SUMMARY</div>
          <div style={{ 
            fontFamily: "'VT323',monospace", 
            fontSize: 18, 
            color: '#2d6a3f', 
            lineHeight: 1.6, 
            whiteSpace: 'pre-wrap',
            background: 'rgba(26,74,46,0.05)',
            padding: '16px',
            border: '2px dashed rgba(26,74,46,0.2)',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {report?.architecture_summary || report?.overview || "No architecture summary available."}
          </div>
        </div>

        {/* Health Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="mc-card" style={{ padding: '24px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.4s ease both' }}>
            <CornerPip color="#fbbf24" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#fbbf24', marginBottom: 18, letterSpacing: 1 }}>▸ PENALTY BREAKDOWN</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { label: 'Density Penalty', value: health?.health_breakdown?.densityPenalty, color: '#60a5fa' },
                { label: 'Cycle Penalty',   value: health?.health_breakdown?.cyclePenalty,   color: '#f87171' },
                { label: 'Severity Penalty', value: health?.health_breakdown?.severityPenalty, color: '#fbbf24' }
              ].map(p => (
                <div key={p.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e', marginBottom: 4 }}>
                    <span>{p.label}</span>
                    <span style={{ color: p.value > 0 ? '#f87171' : '#4ade80' }}>-{p.value?.toFixed(1) || '0.0'}</span>
                  </div>
                  <SegBar pct={Math.min((p.value || 0) * 10, 100)} color={p.color} segments={12} />
                </div>
              ))}
            </div>
          </div>

          <div className="mc-card" style={{ padding: '24px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.48s ease both' }}>
            <CornerPip color="#f87171" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#f87171', marginBottom: 18, letterSpacing: 1 }}>▸ CIRCULAR DEPENDENCIES</div>
            <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
              {(health?.cycles || []).length > 0 ? (
                health.cycles.map((cycle, i) => (
                  <div key={i} style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#ef4444', marginBottom: 8, padding: '8px', background: 'rgba(239,68,68,0.1)', borderLeft: '3px solid #ef4444' }}>
                    {cycle.join(' ➔ ')}
                  </div>
                ))
              ) : (
                <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#4ade80', textAlign: 'center', padding: '10px' }}>
                  No circular dependencies detected! 🎮
                </div>
              )}
            </div>
          </div>

          {/* Layer Distribution Section */}
          <div className="mc-card" style={{ padding: '24px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.52s ease both' }}>
            <CornerPip color="#a78bfa" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#a78bfa', marginBottom: 18, letterSpacing: 1 }}>▸ LAYER DISTRIBUTION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {layers?.layer_distribution ? Object.entries(layers.layer_distribution).map(([layer, count]) => (
                <div key={layer}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'VT323',monospace", fontSize: 16, color: '#1a4a2e', marginBottom: 2 }}>
                    <span style={{ textTransform: 'uppercase' }}>{layer}</span>
                    <span>{count} files</span>
                  </div>
                  <div style={{ height: 4, background: '#020c06', position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', top: 0, left: 0, bottom: 0, 
                      width: `${Math.min((count / report?.total_files) * 100 || 0, 100)}%`, 
                      background: layer === 'unknown' ? '#6b7280' : '#a78bfa' 
                    }} />
                  </div>
                </div>
              )) : (
                <div style={{ color: '#1a4a2e', fontFamily: "'VT323',monospace", fontSize: 16 }}>Scanning directory layers...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Ranking Section */}
      <div className="mc-card" style={{ marginTop: 28, padding: '24px', boxShadow: '4px 4px 0 #040d07', animation: 'fadeUp 0.4s 0.56s ease both' }}>
        <CornerPip color="#f87171" />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#f87171', letterSpacing: 1 }}>🚨 HIGH RISK ASSETS</div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#1a4a2e', opacity: 0.7 }}>Ranked by Severity & Blast Radius</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {risks.length > 0 ? risks.slice(0, 10).map((risk, i) => {
            const fileName = files.find(f => f.id === risk.file_id || f._id === risk.file_id)?.path || risk.file_id;
            const isExternal = !fileName.startsWith('.');
            
            return (
              <div key={i} className="mc-card" style={{ 
                padding: '12px 18px', 
                background: 'rgba(248,113,113,0.05)', 
                border: '1px solid rgba(248,113,113,0.2)',
                display: 'grid',
                gridTemplateColumns: '40px 1fr 120px 100px',
                alignItems: 'center',
                gap: 16
              }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 10, color: '#f87171', opacity: 0.5 }}>#{i+1}</div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: isExternal ? '#60a5fa' : '#1a4a2e', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                    {fileName}
                  </div>
                  {isExternal && <div style={{ fontSize: 10, color: '#60a5fa', opacity: 0.7, fontFamily: "'VT323',monospace" }}>External Dependency</div>}
                </div>
                <div>
                  <div style={{ fontSize: 8, color: '#1a4a2e', marginBottom: 4, fontFamily: "'Press Start 2P',monospace", opacity: 0.7 }}>BLAST RADIUS</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 4, background: '#020c06', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: `${Math.min((risk.impact_count || 0) * 5, 100)}%`, background: '#f87171' }} />
                    </div>
                    <span style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#f87171' }}>{risk.impact_count || 0}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 8, color: '#1a4a2e', marginBottom: 2, fontFamily: "'Press Start 2P',monospace", opacity: 0.7 }}>SEVERITY</div>
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 24, color: (risk.severity_score || 0) > 30 ? '#ef4444' : '#fbbf24' }}>
                    {(risk.severity_score || 0).toFixed(1)}
                  </div>
                </div>
              </div>
            );
          }) : (
            <div style={{ textAlign: 'center', padding: 40, fontFamily: "'VT323',monospace", fontSize: 20, color: '#1a4a2e', opacity: 0.6 }}>
              No risk assessments found for this repository.
            </div>
          )}
        </div>
      </div>
      <XPOrbs count={9} style={{ marginTop: 22, position: 'relative', zIndex: 1 }} />
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   ASK AI
══════════════════════════════════════════════════ */
const SUGGESTIONS = ['What is the entry point?','How does state management work?','Which function handles routing?','What are the main dependencies?','Explain the auth flow.'];

export function RepoAsk() {
  const { repoId } = useParams();
  const [messages, setMessages] = useState([{ role: 'assistant', text: `Hi! I've fully analyzed **${repoId}**. Ask me anything about this codebase — architecture, specific functions, patterns, or how things work.` }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const send = async (text) => {
    if (!text.trim() || loading) return;
    setMessages(m => [...m, { role: 'user', text }]);
    setInput('');
    setLoading(true);
    
    try {
      const res = await api.post('/ask', { repo_id: repoId, question: text });
      if (res.success && res.data) {
        setMessages(m => [...m, { role: 'assistant', text: res.data.answer }]);
      } else {
        throw new Error(res.message || "Failed to get AI response.");
      }
    } catch (err) {
      setMessages(m => [...m, { role: 'assistant', text: `⚠️ Error: ${err.message}. Please try again.` }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  return (
    <>
      <style>{SHARED_CSS}</style>
      <div style={{ background: '#040d07', padding: 'clamp(14px,3vw,28px)', position: 'relative', minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <div className="pg" /><div className="scanline" />
        <RepoTabBar repoId={repoId} />
        <SectionLabel title="ASK AI" sub={`Chat with an AI that has read every file in ${repoId}`} right={<DiamondOre />} />

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 12, paddingRight: 4, position: 'relative', zIndex: 1 }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', animation: 'chatSlide 0.3s ease both' }}>
              <div style={{ maxWidth: '76%', padding: '16px 20px', background: m.role==='user'?'#0d2a14':'#0b1e10', border: `3px solid ${m.role==='user'?'#22c55e':'#1a4528'}`, boxShadow: m.role==='user'?'4px 4px 0 #052e16':'3px 3px 0 #040d07', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -4, [m.role==='user'?'right':'left']: -4, width: 11, height: 11, background: m.role==='user'?'#22c55e':'#1a4528' }} />
                {m.role === 'assistant' && <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#a78bfa', marginBottom: 8, letterSpacing: 1 }}>🤖 REPOLINK AI</div>}
                <div style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: m.role==='user'?'#86efac':'#2d6a3f', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{m.text}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ padding: '14px 20px', background: '#0b1e10', border: '3px solid #1a4528', boxShadow: '3px 3px 0 #040d07' }}>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#a78bfa' }}>
                  Thinking<span style={{ animation: 'mcBlink 0.5s step-end infinite', color: '#4ade80', marginLeft: 4 }}>█</span>
                </span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          {SUGGESTIONS.map(s => <button key={s} className="suggestion-btn" onClick={() => send(s)}>{s}</button>)}
        </div>
        <form onSubmit={e => { e.preventDefault(); send(input); }} style={{ display: 'flex', position: 'relative', zIndex: 1 }}>
          <input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask anything about this codebase..." className="mc-input" style={{ flex: 1, borderRight: 'none' }} />
          <button type="submit" disabled={loading} style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, letterSpacing: 1, padding: '0 22px', color: '#fff', cursor: loading?'not-allowed':'pointer', background: 'linear-gradient(180deg,#16a34a,#15803d)', border: '2px solid #22c55e', borderLeft: '3px solid #22c55e', boxShadow: '4px 4px 0 #052e16', whiteSpace: 'nowrap', opacity: loading?0.6:1 }}>
            {loading ? '...' : '▶ SEND'}
          </button>
        </form>
      </div>
    </>
  );
}

