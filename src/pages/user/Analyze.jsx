import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const EXAMPLES = [
  { url: 'https://github.com/facebook/react',           lang: 'JavaScript', stars: '220k', icon: '⚛️' },
  { url: 'https://github.com/vercel/next.js',           lang: 'TypeScript', stars: '118k', icon: '▲'  },
  { url: 'https://github.com/rust-lang/rust',           lang: 'Rust',       stars: '94k',  icon: '⚙️' },
  { url: 'https://github.com/tailwindlabs/tailwindcss', lang: 'CSS',        stars: '79k',  icon: '🎨' },
];

const STEPS = [
  { icon: '🌐', label: 'Fetching repository metadata...',  color: '#4ade80' },
  { icon: '🗂', label: 'Parsing file structure...',        color: '#60a5fa' },
  { icon: '🔍', label: 'Extracting function signatures...', color: '#fbbf24' },
  { icon: '🕸', label: 'Building call graph...',           color: '#a78bfa' },
  { icon: '🤖', label: 'Running AI analysis...',           color: '#f87171' },
  { icon: '✅', label: 'Analysis complete!',               color: '#4ade80' },
];

const INFO = [
  { icon: '⚡', title: '< 60 SECONDS', desc: 'Average analysis time', color: '#fbbf24' },
  { icon: '🔒', title: 'PRIVACY FIRST', desc: 'Your code is never stored', color: '#4ade80' },
  { icon: '🌍', title: '50+ LANGUAGES', desc: 'We parse almost everything', color: '#60a5fa' },
];

const LANG_COLORS = { JavaScript: '#fbbf24', TypeScript: '#60a5fa', Rust: '#f97316', CSS: '#a78bfa' };

/* ══════════════════════════════════════════════════
   PIXEL ATOMS
══════════════════════════════════════════════════ */
function Torch({ style = {} }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF(x => (x + 1) % 3), 110); return () => clearInterval(id); }, []);
  const fc = ['#ff8c00', '#ff5500', '#ffaa00'][f];
  return (
    <div style={{ position: 'relative', width: 12, height: 28, flexShrink: 0, ...style }}>
      <div style={{ position: 'absolute', top: 0, left: 2, width: 8, height: 7, background: fc, boxShadow: `0 0 ${5 + f * 3}px ${fc}`, transition: 'all 0.09s' }} />
      <div style={{ position: 'absolute', top: 6, left: 4, width: 4, height: 14, background: '#8B5E3C' }} />
    </div>
  );
}

function DiamondOre({ size = 36 }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const id = setInterval(() => setPhase(p => (p + 1) % 4), 500); return () => clearInterval(id); }, []);
  const glows = ['drop-shadow(0 0 3px #00d4ff)', 'drop-shadow(0 0 8px #00d4ff)', 'drop-shadow(0 0 5px #00eeff)', 'drop-shadow(0 0 3px #00d4ff)'];
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ imageRendering: 'pixelated', filter: glows[phase], transition: 'filter 0.4s' }}>
      <rect width="12" height="12" fill="#7a7a7a" /><rect x="1" y="1" width="10" height="10" fill="#8a8a8a" />
      <rect x="2" y="2" width="8" height="8" fill="#7a7a7a" /><rect x="2" y="3" width="2" height="2" fill="#00d4ff" />
      <rect x="7" y="5" width="3" height="2" fill="#00d4ff" /><rect x="4" y="7" width="2" height="2" fill="#00d4ff" />
      <rect x="3" y="3" width="1" height="1" fill="#aaffff" />
    </svg>
  );
}

function SegBar({ pct, color, segments = 20 }) {
  const filled = Math.round((pct / 100) * segments);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 6, background: i < filled ? color : '#0d2a14', boxShadow: i < filled ? `0 0 4px ${color}88` : 'none' }} />
      ))}
    </div>
  );
}

function XPOrbs({ count = 10, style = {} }) {
  return (
    <div style={{ display: 'flex', gap: 4, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#a3e635', boxShadow: '0 0 5px #a3e635', animation: `xpBounce 1.4s ${i * 0.1}s ease-in-out infinite`, opacity: 1 - i * 0.08 }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   LOADING SCREEN
══════════════════════════════════════════════════ */
function AnalysisLoader({ url, step }) {
  const pct = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <div style={{
      background: '#0b1e10', border: '4px solid #22c55e',
      padding: '48px 40px', textAlign: 'center',
      boxShadow: '8px 8px 0 #040d07, 0 0 40px rgba(74,222,128,0.15)',
      animation: 'rainbowBorder 5s ease-in-out infinite',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Corner pips */}
      {[{ top: -4, left: -4 }, { top: -4, right: -4 }, { bottom: -4, left: -4 }, { bottom: -4, right: -4 }].map((pos, i) => (
        <div key={i} style={{ position: 'absolute', width: 14, height: 14, background: '#22c55e', boxShadow: '0 0 8px #22c55e99', ...pos }} />
      ))}

      <div className="pg" />

      {/* Title */}
      <div style={{
        fontFamily: "'Press Start 2P',monospace", fontSize: 12,
        color: '#4ade80', textShadow: '3px 3px 0 #040d07',
        animation: 'neonPulse 2s ease-in-out infinite',
        marginBottom: 10, lineHeight: 1.7,
      }}>
        ANALYZING REPOSITORY...
      </div>

      {/* URL chip */}
      <div style={{
        display: 'inline-block', marginBottom: 36,
        fontFamily: "'VT323',monospace", fontSize: 17, color: '#1a4a2e',
        border: '2px solid #1a4528', padding: '4px 14px', background: '#020c06',
      }}>
        {url}
        <span style={{ animation: 'mcBlink 0.9s step-end infinite', color: '#4ade80', marginLeft: 4 }}>█</span>
      </div>

      {/* Step list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420, margin: '0 auto 36px', textAlign: 'left' }}>
        {STEPS.map(({ icon, label, color }, i) => {
          const done    = i < step;
          const active  = i === step;
          const pending = i > step;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '10px 16px',
              background: active ? '#0d2a14' : 'transparent',
              border: `2px solid ${active ? color : done ? '#1a4528' : '#0d2a14'}`,
              transition: 'all 0.3s',
              boxShadow: active ? `0 0 14px ${color}33` : 'none',
              animation: done || active ? `fadeUp 0.3s ease both` : 'none',
            }}>
              {/* State icon */}
              <div style={{
                width: 28, height: 28, flexShrink: 0,
                background: '#020c06', border: `2px solid ${done ? '#22c55e' : active ? color : '#0d2a14'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
              }}>
                {done ? '✓' : active ? icon : '◻'}
              </div>
              <span style={{
                fontFamily: "'VT323',monospace", fontSize: 19,
                color: done ? '#2d6a3f' : active ? '#86efac' : '#1a4a2e',
                flex: 1, transition: 'color 0.3s',
              }}>
                {label}
              </span>
              {/* Color pip for active */}
              {active && <div style={{ width: 8, height: 8, background: color, boxShadow: `0 0 8px ${color}`, animation: 'xpBounce 0.8s ease-in-out infinite' }} />}
              {done && <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#22c55e' }}>DONE</span>}
            </div>
          );
        })}
      </div>

      {/* Overall progress bar */}
      <div style={{ maxWidth: 420, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e' }}>ANALYSIS PROGRESS</span>
          <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#22c55e' }}>{pct}%</span>
        </div>
        <div style={{ height: 18, border: '3px solid #1a4528', background: '#020c06', position: 'relative' }}>
          <div style={{
            position: 'absolute', inset: 2,
            width: `${pct}%`,
            background: 'linear-gradient(90deg,#15803d,#22c55e,#86efac)',
            boxShadow: '0 0 14px rgba(74,222,128,0.6)',
            transition: 'width 0.6s ease',
          }} />
          {/* Segment ticks */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} style={{ position: 'absolute', left: `${(i + 1) * (100 / 6)}%`, top: 0, bottom: 0, width: 2, background: '#020c06', zIndex: 2 }} />
          ))}
        </div>
        <XPOrbs count={8} style={{ justifyContent: 'center', marginTop: 16 }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   MAIN ANALYZE PAGE
══════════════════════════════════════════════════ */
export default function Analyze() {
  const [url, setUrl]       = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep]     = useState(0);
  const [depth, setDepth]   = useState('Standard');
  const [branch, setBranch] = useState('');
  const [pvt, setPvt]       = useState(false);
  const [error, setError]   = useState(null);
  const [analyzeResponse, setAnalyzeResponse] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    
    setLoading(true); 
    setStep(0);
    setError(null);

    try {
      // Trigger the real API call
      const response = await api.post('/analyze', { 
        repo_url: url 
      });
      setAnalyzeResponse(response);

      // Simulation of visual steps for aesthetic effect during analysis
      // Spread steps over ~25-30 seconds to match real backend time
      for (let i = 0; i < STEPS.length - 1; i++) {
        await new Promise(r => setTimeout(r, 4500));
        setStep(i);
      }
      
      setStep(STEPS.length - 1);
      await new Promise(r => setTimeout(r, 2000));

      // Use the repo_id from backend if available, fallback to parts for route
      const navigateId = response.repo_id || url.replace('https://github.com/', '').split('/').slice(0, 2).join('-').replace(/[^a-z0-9-]/gi, '-');
      navigate(`/${navigateId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');
        @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-6px) scale(1.2);}}
        @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes mcFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
        @keyframes neonPulse{0%,100%{text-shadow:3px 3px 0 #040d07,0 0 15px rgba(74,222,128,0.3);}50%{text-shadow:3px 3px 0 #040d07,0 0 35px rgba(74,222,128,0.7);}}
        @keyframes xpPop{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}
        @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
        @keyframes rainbowBorder{
          0%{box-shadow:8px 8px 0 #040d07,0 0 30px rgba(74,222,128,0.2);}
          33%{box-shadow:8px 8px 0 #040d07,0 0 30px rgba(96,165,250,0.2);}
          66%{box-shadow:8px 8px 0 #040d07,0 0 30px rgba(167,139,250,0.2);}
          100%{box-shadow:8px 8px 0 #040d07,0 0 30px rgba(74,222,128,0.2);}
        }
        .pg{position:absolute;inset:0;background-image:linear-gradient(rgba(74,222,128,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.025) 1px,transparent 1px);background-size:36px 36px;pointer-events:none;}
        .scanline{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
        .scanline::after{content:'';position:absolute;left:0;right:0;height:2px;background:rgba(74,222,128,0.04);animation:scanMove 12s linear infinite;}

        /* Pixel input */
        .mc-input{
          width:100%;padding:13px 16px;box-sizing:border-box;
          background:#020c06;border:2px solid #1a4528;
          color:#4ade80;font-family:'VT323',monospace;font-size:20px;
          outline:none;transition:border-color 0.15s,box-shadow 0.15s;
        }
        .mc-input:focus{border-color:#4ade80;box-shadow:0 0 0 2px rgba(74,222,128,0.2);}
        .mc-input::placeholder{color:#1a4528;}

        .mc-select{
          width:100%;padding:11px 14px;box-sizing:border-box;
          background:#020c06;border:2px solid #1a4528;
          color:#4ade80;font-family:'VT323',monospace;font-size:20px;
          outline:none;cursor:pointer;
        }
        .mc-select:focus{border-color:#4ade80;}

        .mc-label{
          display:block;font-family:'Press Start 2P',monospace;font-size:7px;
          color:#2d6a3f;letter-spacing:1px;margin-bottom:9px;
        }
      `}</style>

      <div style={{ background: '#040d07', minHeight: '100%', padding: 'clamp(14px,3vw,32px)', position: 'relative' }}>
        <div className="pg" />
        <div className="scanline" />

        <div style={{ maxWidth: 700, margin: '0 auto', position: 'relative', zIndex: 2 }}>

          {/* ── PAGE HEADER ── */}
          <div style={{ marginBottom: 32, animation: 'fadeUp 0.4s ease both' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14,
              border: '2px solid #22c55e', padding: '5px 16px',
              fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#4ade80', letterSpacing: 2,
              background: 'rgba(21,128,61,0.12)', boxShadow: '3px 3px 0 #040d07',
            }}>
              <Torch /><span style={{ animation: 'xpBounce 1s ease-in-out infinite' }}>✦</span>
              REPO ANALYZER
              <span style={{ animation: 'xpBounce 1s 0.5s ease-in-out infinite' }}>✦</span><Torch />
            </div>
            <h1 style={{
              fontFamily: "'Press Start 2P',monospace",
              fontSize: 'clamp(12px,1.8vw,17px)',
              color: '#4ade80', animation: 'neonPulse 3s ease-in-out infinite',
              lineHeight: 1.7, marginBottom: 8,
            }}>
              ANALYZE A REPOSITORY
            </h1>
            <p style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#2d6a3f' }}>
              Paste any GitHub, GitLab, or Bitbucket URL to begin AI analysis.
            </p>
          </div>

          {/* ── LOADING or FORM ── */}
          {loading ? (
            <AnalysisLoader url={url} step={step} />
          ) : (
            <>
              {/* ── MAIN FORM CARD ── */}
              <div style={{
                background: '#0b1e10', border: '4px solid #22c55e',
                padding: 'clamp(16px,3vw,32px)', marginBottom: 24,
                boxShadow: '6px 6px 0 #040d07, 0 0 30px rgba(74,222,128,0.1)',
                position: 'relative', overflow: 'hidden',
                animation: 'fadeUp 0.45s 0.05s ease both',
              }}>
                {/* Corner pips */}
                {[{ top: -4, left: -4 }, { top: -4, right: -4 }, { bottom: -4, left: -4 }, { bottom: -4, right: -4 }].map((pos, i) => (
                  <div key={i} style={{ position: 'absolute', width: 12, height: 12, background: '#22c55e', boxShadow: '0 0 6px #22c55e', ...pos }} />
                ))}
                <div className="pg" />

                <form onSubmit={handleSubmit}>
                  {/* URL input row */}
                  <label className="mc-label" htmlFor="repo-url">REPOSITORY URL</label>
                  <div style={{ display: 'flex', marginBottom: 24 }}>
                    <input
                      id="repo-url" type="url" required
                      value={url} onChange={e => setUrl(e.target.value)}
                      placeholder="https://github.com/owner/repository"
                      className="mc-input"
                      style={{ flex: 1, borderRight: 'none' }}
                    />
                    <button type="submit" style={{
                      fontFamily: "'Press Start 2P',monospace", fontSize: 8, letterSpacing: 1,
                      padding: '0 22px', color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap',
                      background: 'linear-gradient(180deg,#16a34a,#15803d)',
                      border: '2px solid #22c55e', borderLeft: '3px solid #22c55e',
                      boxShadow: '4px 4px 0 #052e16',
                      transition: 'all 0.1s', position: 'relative', overflow: 'hidden',
                    }}
                      onMouseOver={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '6px 6px 0 #052e16'; }}
                      onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #052e16'; }}
                    >
                      <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,0.1) 0%,transparent 50%)', pointerEvents: 'none' }} />
                      ▶ ANALYZE
                    </button>
                  </div>

                  {error && (
                    <div style={{
                      padding: '12px 16px', background: 'rgba(248,113,113,0.1)',
                      border: '2px solid #f87171', color: '#f87171',
                      fontFamily: "'VT323',monospace", fontSize: 18, marginBottom: 24,
                      display: 'flex', alignItems: 'center', gap: 10
                    }}>
                      <span style={{ fontSize: 24 }}>👾</span>
                      <span>ERROR: {error}</span>
                    </div>
                  )}

                  {/* Options grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18, marginBottom: 20 }}>
                    <div>
                      <label className="mc-label" htmlFor="branch">BRANCH (optional)</label>
                      <input
                        id="branch" type="text"
                        value={branch} onChange={e => setBranch(e.target.value)}
                        placeholder="main"
                        className="mc-input"
                      />
                    </div>
                    <div>
                      <label className="mc-label" htmlFor="depth">ANALYSIS DEPTH</label>
                      <select id="depth" value={depth} onChange={e => setDepth(e.target.value)} className="mc-select">
                        <option>Standard</option>
                        <option>Deep</option>
                        <option>Quick</option>
                      </select>
                    </div>
                  </div>

                  {/* Depth indicator */}
                  <div style={{ marginBottom: 20 }}>
                    <SegBar
                      pct={depth === 'Quick' ? 35 : depth === 'Standard' ? 65 : 95}
                      color={depth === 'Quick' ? '#fbbf24' : depth === 'Standard' ? '#4ade80' : '#a78bfa'}
                      segments={18}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                      <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e' }}>QUICK</span>
                      <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e' }}>STANDARD</span>
                      <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e' }}>DEEP</span>
                    </div>
                  </div>

                  {/* Private toggle */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 16px', background: '#020c06',
                    border: `2px solid ${pvt ? '#22c55e' : '#1a4528'}`,
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }} onClick={() => setPvt(p => !p)}>
                    {/* Pixel checkbox */}
                    <div style={{
                      width: 18, height: 18, background: pvt ? '#22c55e' : '#0d2a14',
                      border: `2px solid ${pvt ? '#4ade80' : '#1a4528'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.12s',
                      boxShadow: pvt ? '0 0 8px #22c55e99' : 'none',
                    }}>
                      {pvt && <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#fff', lineHeight: 1 }}>✓</span>}
                    </div>
                    <span style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: pvt ? '#4ade80' : '#2d6a3f', transition: 'color 0.15s' }}>
                      Private repository (requires GitHub token in settings)
                    </span>
                    <div style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      <DiamondOre size={28} />
                    </div>
                  </div>
                </form>
              </div>

              {/* ── EXAMPLE REPOS ── */}
              <div style={{ marginBottom: 24, animation: 'fadeUp 0.45s 0.15s ease both' }}>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', letterSpacing: 2, marginBottom: 14 }}>
                  ▸ TRY AN EXAMPLE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10 }}>
                  {EXAMPLES.map(({ url: ex, lang, stars, icon }, i) => {
                    const lc = LANG_COLORS[lang] || '#4ade80';
                    return (
                      <button key={ex} onClick={() => setUrl(ex)} style={{
                        background: '#0b1e10', border: '3px solid #1a4528',
                        color: '#4ade80', cursor: 'pointer', textAlign: 'left',
                        padding: '14px 16px', transition: 'all 0.15s',
                        boxShadow: '3px 3px 0 #040d07', position: 'relative', overflow: 'hidden',
                        animation: `fadeUp 0.4s ${0.2 + i * 0.07}s ease both`,
                      }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = lc; e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = `5px 5px 0 #040d07, 0 0 12px ${lc}33`; }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #040d07'; }}
                      >
                        {/* Left accent */}
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: lc }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 8 }}>
                          <span style={{ fontSize: 20 }}>{icon}</span>
                          <div>
                            <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#86efac', marginBottom: 2 }}>
                              {ex.replace('https://github.com/', '')}
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                              <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: lc }}>● {lang}</span>
                              <span style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#1a4a2e' }}>⭐ {stars}</span>
                            </div>
                          </div>
                          <span style={{ marginLeft: 'auto', fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#1a4528' }}>↗</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── INFO CARDS ── */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, animation: 'fadeUp 0.45s 0.28s ease both' }}>
                {INFO.map(({ icon, title, desc, color }, i) => (
                  <div key={title} style={{
                    background: '#0b1e10', border: '3px solid #1a4528',
                    padding: '22px 16px', textAlign: 'center',
                    boxShadow: '4px 4px 0 #040d07', position: 'relative', overflow: 'hidden',
                    transition: 'all 0.18s',
                  }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translate(-3px,-3px)'; e.currentTarget.style.boxShadow = `6px 6px 0 #040d07, 0 0 16px ${color}33`; }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '4px 4px 0 #040d07'; }}
                  >
                    <div style={{ position: 'absolute', top: -4, right: -4, width: 12, height: 12, background: color, boxShadow: `0 0 6px ${color}` }} />
                    <div style={{ fontSize: 28, marginBottom: 10, animation: `mcFloat ${2.5 + i * 0.3}s ease-in-out infinite` }}>{icon}</div>
                    <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color, marginBottom: 8, lineHeight: 1.6 }}>{title}</div>
                    <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#1a4a2e' }}>{desc}</div>
                  </div>
                ))}
              </div>

              {/* XP orbs footer */}
              <XPOrbs count={10} style={{ justifyContent: 'center', marginTop: 24 }} />

              {analyzeResponse && <div style={{ marginTop: 16 }} />}
            </>
          )}
        </div>
      </div>
    </>
  );
}
