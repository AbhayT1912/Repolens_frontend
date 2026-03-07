import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

/* ══════════════════════════════════════════════════
   SCROLL REVEAL HOOK
══════════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════════
   PIXEL ATOMS
══════════════════════════════════════════════════ */
function DiamondOre({ size = 44, style = {} }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const id = setInterval(() => setPhase(p => (p + 1) % 4), 500); return () => clearInterval(id); }, []);
  const glows = ['drop-shadow(0 0 3px #00d4ff)', 'drop-shadow(0 0 8px #00d4ff)', 'drop-shadow(0 0 6px #00eeff)', 'drop-shadow(0 0 4px #00d4ff)'];
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ imageRendering: 'pixelated', filter: glows[phase], transition: 'filter 0.4s', ...style }}>
      <rect width="12" height="12" fill="#7a7a7a" />
      <rect x="1" y="1" width="10" height="10" fill="#8a8a8a" />
      <rect x="2" y="2" width="8" height="8" fill="#7a7a7a" />
      <rect x="2" y="3" width="2" height="2" fill="#00d4ff" />
      <rect x="3" y="2" width="2" height="2" fill="#00aacc" />
      <rect x="7" y="5" width="3" height="2" fill="#00d4ff" />
      <rect x="8" y="7" width="2" height="2" fill="#00aacc" />
      <rect x="4" y="7" width="2" height="2" fill="#00d4ff" />
      <rect x="3" y="3" width="1" height="1" fill="#aaffff" />
      <rect x="8" y="6" width="1" height="1" fill="#aaffff" />
    </svg>
  );
}

function TNTBlock({ size = 44, style = {} }) {
  const [flash, setFlash] = useState(false);
  useEffect(() => { const id = setInterval(() => { setFlash(true); setTimeout(() => setFlash(false), 180); }, 2800); return () => clearInterval(id); }, []);
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ imageRendering: 'pixelated', filter: flash ? 'brightness(3) drop-shadow(0 0 10px red)' : 'none', transition: 'filter 0.1s', ...style }}>
      <rect width="12" height="12" fill="#8b0000" />
      <rect x="1" y="1" width="10" height="2" fill="#cc2200" />
      <rect x="1" y="9" width="10" height="2" fill="#cc2200" />
      <rect x="2" y="4" width="8" height="4" fill="#f0f0f0" />
      <rect x="3" y="5" width="1" height="2" fill="#cc0000" />
      <rect x="5" y="4" width="2" height="4" fill="#cc0000" />
      <rect x="8" y="5" width="1" height="2" fill="#cc0000" />
    </svg>
  );
}

function OakTree({ size = 80, style = {} }) {
  return (
    <svg width={size * 0.8} height={size} viewBox="0 0 12 18" style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="3" y="0" width="6" height="2" fill="#2d8a2d" />
      <rect x="1" y="1" width="10" height="3" fill="#3aaa3a" />
      <rect x="0" y="3" width="12" height="4" fill="#2d8a2d" />
      <rect x="1" y="6" width="10" height="3" fill="#3aaa3a" />
      <rect x="2" y="8" width="8" height="3" fill="#2d8a2d" />
      <rect x="3" y="2" width="2" height="1" fill="#50c850" />
      <rect x="7" y="4" width="2" height="1" fill="#50c850" />
      <rect x="4" y="10" width="4" height="8" fill="#8B5E3C" />
      <rect x="5" y="11" width="1" height="6" fill="#a07040" />
    </svg>
  );
}

function Chest({ size = 56, style = {} }) {
  const [open, setOpen] = useState(false);
  const [loot, setLoot] = useState([]);
  useEffect(() => {
    const id = setInterval(() => {
      setOpen(true); setLoot(['💎','⚔️','🪙','✨']);
      setTimeout(() => { setOpen(false); setLoot([]); }, 1400);
    }, 3800);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.1, ...style }}>
      {loot.map((item, i) => (
        <div key={i} style={{ position: 'absolute', fontSize: 11, bottom: size * 0.55, left: '50%', marginLeft: (i - 1.5) * 13, animation: 'lootFloat 1.1s ease-out forwards', animationDelay: `${i * 0.08}s`, zIndex: 10, pointerEvents: 'none' }}>{item}</div>
      ))}
      <svg width={size} height={size * 0.5} viewBox="0 0 16 8" style={{ imageRendering: 'pixelated', position: 'absolute', top: 0, zIndex: 2, transformOrigin: '50% 100%', transform: open ? 'perspective(80px) rotateX(-80deg)' : 'rotateX(0deg)', transition: 'transform 0.5s cubic-bezier(0.2,0,0.2,1)' }}>
        <rect x="0" y="0" width="16" height="7" fill="#8B5E3C" />
        <rect x="1" y="1" width="14" height="5" fill="#A0702A" />
        <rect x="0" y="6" width="16" height="1" fill="#5C3D1E" />
      </svg>
      <svg width={size} height={size * 0.6} viewBox="0 0 16 10" style={{ imageRendering: 'pixelated', position: 'absolute', bottom: 0 }}>
        <rect x="0" y="0" width="16" height="10" fill="#8B5E3C" />
        <rect x="1" y="1" width="14" height="8" fill="#A0702A" />
        <rect x="6" y="3" width="4" height="4" fill="#C8A020" />
        <rect x="7" y="4" width="2" height="2" fill="#8B6010" />
      </svg>
    </div>
  );
}

function GroundStrip({ colors, h }) {
  return (
    <div style={{ display: 'flex', height: h, width: '100%', flexShrink: 0 }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{ flex: '1 0 0', background: colors[i % colors.length], boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.25), inset 2px 2px 0 rgba(255,255,255,0.07)', borderRight: '1px solid rgba(0,0,0,0.12)' }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const FEATURES = [
  {
    icon: '🕸', title: 'Interactive Call Graph', color: '#4ade80',
    desc: 'Visualize function call relationships across your entire codebase in a zoomable, filterable node graph. Color-coded by file, filterable by depth, and clickable to drill into any function.',
    bullets: ['Force-directed graph layout', 'Filter by module or directory', 'Click any node to view function detail', 'Export as SVG or PNG'],
  },
  {
    icon: '🤖', title: 'AI-Powered Q&A', color: '#a78bfa',
    desc: 'Ask any question about the repo in natural language. RepoLink searches the codebase, reads relevant files, and returns precise, cited answers.',
    bullets: ['Cite specific files and lines', 'Multi-turn conversation context', 'Understands architecture patterns', 'Works on 50+ languages'],
  },
  {
    icon: '🗂', title: 'Smart File Structure', color: '#fbbf24',
    desc: 'An intelligent tree view that understands your project. Not just a file browser — it highlights important entry points, flags dead code, and groups related files.',
    bullets: ['Highlight entry points and exports', 'Flag unused files', 'Group by domain or type', 'Search across all filenames'],
  },
  {
    icon: '📊', title: 'Code Analytics Dashboard', color: '#f87171',
    desc: 'Deep metrics on complexity, maintainability, and code health. Identify hotspots before they become problems.',
    bullets: ['Cyclomatic complexity per function', 'Lines of code over time', 'Language & framework breakdown', 'Contributor impact heatmap'],
  },
  {
    icon: '🔍', title: 'Function Deep Dive', color: '#34d399',
    desc: 'Click any function to get a complete profile: callers, callees, parameters, return type, AI-generated explanation, and change history.',
    bullets: ['Full caller/callee tree', 'Parameter & return type inference', 'AI-generated docstrings', 'Git blame & history integration'],
  },
  {
    icon: '🕐', title: 'Analysis History', color: '#60a5fa',
    desc: 'Every analysis is saved and versioned. Track how your codebase changes over time, compare two snapshots, or revisit a previous analysis instantly.',
    bullets: ['Infinite analysis history', 'Side-by-side snapshot comparison', 'Shareable analysis links', 'Team-visible history'],
  },
];

const LANGS = [
  { name: 'TypeScript / JavaScript', pct: 98, c: '#4ade80' },
  { name: 'Python',                  pct: 95, c: '#60a5fa' },
  { name: 'Rust',                    pct: 88, c: '#f87171' },
  { name: 'Go',                      pct: 92, c: '#34d399' },
  { name: 'Java / Kotlin',           pct: 85, c: '#fbbf24' },
  { name: 'C / C++',                 pct: 78, c: '#a78bfa' },
  { name: 'Ruby / Rails',            pct: 82, c: '#f472b6' },
  { name: 'PHP',                     pct: 76, c: '#fb923c' },
];

/* ══════════════════════════════════════════════════
   FEATURES PAGE
══════════════════════════════════════════════════ */
export default function Features() {
  useScrollReveal();

  return (
    <div style={{ background: '#040d07' }}>

      {/* ── HERO ── */}
      <section style={{
        padding: '40px clamp(16px,6vw,80px) 40px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(180deg,#000a04 0%,#040d07 100%)',
        borderBottom: '4px solid #22c55e', textAlign: 'center',
      }}>
        <div className="pg" />
        <div className="scanline" />

        {/* Floating blocks */}
        {[
          { t:'12%', l:'4%',  s:28, c:'#4ade80' },
          { t:'30%', r:'5%',  s:22, c:'#92400e' },
          { t:'60%', l:'2%',  s:18, c:'#1d4ed8' },
          { t:'18%', r:'3%',  s:24, c:'#86efac' },
          { t:'55%', r:'6%',  s:16, c:'#7c3aed' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', top: b.t, left: b.l, right: b.r,
            width: b.s, height: b.s, background: b.c, opacity: 0.55,
            boxShadow: `inset -${b.s*0.14}px -${b.s*0.14}px 0 rgba(0,0,0,0.5)`,
            animation: `mcFloat ${3+i*0.4}s ${i*0.6}s ease-in-out infinite`,
            imageRendering: 'pixelated', zIndex: 1,
          }} />
        ))}

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div className="sec-badge" style={{ marginBottom: 24 }}>
            <span style={{ animation: 'xpBounce 1s ease-in-out infinite' }}>✦</span>
            FULL FEATURE LIST
            <span style={{ animation: 'xpBounce 1s 0.5s ease-in-out infinite' }}>✦</span>
          </div>

          <h1 style={{
            fontFamily: "'Press Start 2P',monospace",
            fontSize: 'clamp(14px,2.4vw,26px)',
            color: '#4ade80',
            animation: 'neonPulse 3s ease-in-out infinite',
            textShadow: '4px 4px 0 #040d07',
            lineHeight: 1.7, marginBottom: 22,
          }}>
            EVERYTHING IN THE BOX
          </h1>

          {/* XP bar */}
          <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginBottom: 24 }}>
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} style={{
                width: 13, height: 5,
                background: i < 18 ? '#22c55e' : '#0d2a14',
                boxShadow: i < 18 ? '0 0 5px #22c55e' : 'none',
                animation: `xpPop ${0.4+i*0.03}s ${i*0.06}s ease-in-out infinite`,
              }} />
            ))}
          </div>

          <p style={{ fontFamily: "'VT323',monospace", fontSize: 22, color: '#2d6a3f', maxWidth: 580, margin: '0 auto' }}>
            RepoLink is the most complete AI code analysis platform for developers who need to understand unfamiliar codebases fast.
          </p>
        </div>

        <GroundStrip colors={['#4a8c3f','#3a7230','#2d5a26','#4a8c3f']} h={14} />
        <GroundStrip colors={['#6b4226','#8B5E3C','#5c3d1e','#6b4226']} h={10} />
      </section>

      {/* ── FEATURE CARDS GRID ── */}
      <section style={{ padding: 'clamp(28px,6vw,90px) clamp(16px,6vw,80px)', position: 'relative', background: '#050f08', overflow: 'hidden' }}>
        <div className="pg" />

        {/* Corner deco */}
        <div style={{ position: 'absolute', top: 32, left: 32, animation: 'mcFloat 3.5s ease-in-out infinite' }}><DiamondOre size={36} /></div>
        <div style={{ position: 'absolute', top: 32, right: 32, animation: 'mcFloat 3.5s 1s ease-in-out infinite' }}><TNTBlock size={32} /></div>
        <div style={{ position: 'absolute', bottom: 48, left: 24, animation: 'mcFloat 4s 0.5s ease-in-out infinite' }}><OakTree size={72} /></div>
        <div style={{ position: 'absolute', bottom: 48, right: 24, animation: 'mcFloat 3.5s 1.5s ease-in-out infinite' }}><Chest size={48} /></div>

        <div data-reveal style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="sec-badge" style={{ marginBottom: 16 }}>✦ INVENTORY UNLOCKED ✦</div>
          <h2 style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 'clamp(11px,1.6vw,16px)', color: '#4ade80', textShadow: '3px 3px 0 #040d07', lineHeight: 1.7 }}>
            EVERY TOOL YOU NEED
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24 }}>
          {FEATURES.map(({ icon, title, desc, bullets, color }, i) => (
            <div key={i} data-reveal data-d={`${(i % 3) + 1}`}
              className="fcard"
              onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translate(-4px,-4px)'; e.currentTarget.style.boxShadow = `8px 8px 0 #040d07, 0 0 28px ${color}33`; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'none'; }}
            >
              {/* Ore corner pip */}
              <div style={{ position: 'absolute', top: -5, right: -5, width: 20, height: 20, background: color, boxShadow: `0 0 10px ${color}99` }} />

              {/* Icon + title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
                <div className="inv-slot" style={{ width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color, lineHeight: 1.7, marginBottom: 6 }}>{title}</div>
                  {/* Mini star row */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <div key={j} style={{ width: 8, height: 8, background: j < 4 ? color : '#1a3d20', boxShadow: j < 4 ? `0 0 5px ${color}88` : 'none' }} />
                    ))}
                  </div>
                </div>
              </div>

              <p style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#2d6a3f', lineHeight: 1.7, marginBottom: 16 }}>{desc}</p>

              {/* Bullets */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
                {bullets.map((b, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'VT323',monospace", fontSize: 16, color: '#1a4a2e' }}>
                    <span style={{ color, flexShrink: 0, fontSize: 12 }}>▸</span>
                    {b}
                  </div>
                ))}
              </div>

              {/* Durability bar */}
              <div style={{ height: 6, background: '#040d07', border: '2px solid #1a4528' }}>
                <div style={{ height: '100%', width: `${62 + i * 5}%`, background: `linear-gradient(90deg,${color}88,${color})`, boxShadow: `0 0 8px ${color}66` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <GroundStrip colors={['#4a8c3f','#3a7230','#4a8c3f']} h={12} />
      <GroundStrip colors={['#6b4226','#8B5E3C','#6b4226']} h={9} />

      {/* ── LANGUAGE SUPPORT ── */}
      <section style={{ padding: 'clamp(28px,6vw,90px) clamp(16px,6vw,80px)', background: '#040d07', position: 'relative', overflow: 'hidden' }}>
        <div className="pg" />
        <div className="scanline" />

        <div data-reveal style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="sec-badge" style={{ marginBottom: 16 }}>✦ CRAFTING RECIPES ✦</div>
          <h2 style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 'clamp(11px,1.6vw,16px)', color: '#4ade80', textShadow: '3px 3px 0 #040d07', lineHeight: 1.7, marginBottom: 16 }}>
            LANGUAGE COVERAGE
          </h2>
          <p style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#2d6a3f' }}>
            RepoLink parses, indexes, and understands 50+ languages.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20, maxWidth: 860, margin: '0 auto' }}>
          {LANGS.map(({ name, pct, c }, i) => (
            <div key={name} data-reveal data-d={`${(i % 2) + 1}`} style={{ background: '#0b1e10', border: '3px solid #1a4528', padding: '18px 22px', transition: 'all 0.18s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = c; e.currentTarget.style.transform = 'translate(-2px,-2px)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: c }}>{name}</span>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: c }}>{pct}%</span>
              </div>
              {/* Segmented bar */}
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 20 }).map((_, j) => (
                  <div key={j} style={{
                    flex: 1, height: 10,
                    background: j < Math.round(pct / 5) ? c : '#0d2a14',
                    boxShadow: j < Math.round(pct / 5) ? `0 0 4px ${c}88` : 'none',
                    transition: 'background 0.3s',
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <GroundStrip colors={['#4a8c3f','#3a7230','#4a8c3f']} h={12} />
      <GroundStrip colors={['#6b4226','#8B5E3C','#6b4226']} h={9} />

      {/* ── CTA ── */}
      <section style={{ padding: 'clamp(34px,7vw,100px) clamp(16px,6vw,80px)', textAlign: 'center', position: 'relative', overflow: 'hidden', background: '#020a05' }}>
        <div className="pg" />
        <div className="scanline" />

        <div data-reveal>
          <div className="sec-badge" style={{ marginBottom: 20 }}>✦ FINAL QUEST ✦</div>
          <h2 style={{
            fontFamily: "'Press Start 2P',monospace",
            fontSize: 'clamp(13px,2vw,20px)',
            color: '#4ade80', lineHeight: 1.7, marginBottom: 18,
            animation: 'neonPulse 2.5s ease-in-out infinite',
          }}>
            READY TO EXPLORE?
          </h2>
          <p style={{ fontFamily: "'VT323',monospace", fontSize: 21, color: '#2d6a3f', marginBottom: 40 }}>
            Start analyzing repositories for free. No credit card required.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: "'Press Start 2P',monospace", fontSize: 9, letterSpacing: 1,
              padding: '16px 40px', color: '#fff', textDecoration: 'none',
              background: 'linear-gradient(180deg,#16a34a,#15803d)',
              border: '3px solid #22c55e', boxShadow: '6px 6px 0 #052e16',
              transition: 'all 0.1s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translate(-3px,-3px)'; e.currentTarget.style.boxShadow = '9px 9px 0 #052e16'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '6px 6px 0 #052e16'; }}
            >
              ▶ Start Free Trial
            </Link>
            <Link to="/pricing" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontFamily: "'Press Start 2P',monospace", fontSize: 9, letterSpacing: 1,
              padding: '16px 40px', color: '#4ade80', textDecoration: 'none',
              background: 'transparent',
              border: '3px solid #22c55e', boxShadow: '6px 6px 0 #052e16',
              transition: 'all 0.1s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translate(-3px,-3px)'; e.currentTarget.style.boxShadow = '9px 9px 0 #052e16'; }}
              onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '6px 6px 0 #052e16'; }}
            >
              View Pricing
            </Link>
          </div>

          {/* XP orbs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 36 }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#a3e635', boxShadow: '0 0 6px #a3e635', animation: `xpBounce 1.4s ${i * 0.09}s ease-in-out infinite`, opacity: 1 - i * 0.05 }} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
