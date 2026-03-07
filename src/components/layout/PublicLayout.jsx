import { Outlet, Link, NavLink } from 'react-router-dom';
import { CreeperIcon } from '../ui';
import { useState, useEffect } from 'react';

/* ══════════════════════════════════════════════════
   SHARED PIXEL ATOMS
══════════════════════════════════════════════════ */
function Torch({ style = {} }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF(x => (x + 1) % 3), 110); return () => clearInterval(id); }, []);
  const fc = ['#ff8c00', '#ff5500', '#ffaa00'][f];
  return (
    <div style={{ position: 'relative', width: 14, height: 32, flexShrink: 0, ...style }}>
      <div style={{ position: 'absolute', top: 0, left: 3, width: 8, height: 8, background: fc, boxShadow: `0 0 ${6 + f * 3}px ${fc}, 0 0 14px ${fc}88`, transition: 'all 0.09s' }} />
      <div style={{ position: 'absolute', top: 7, left: 5, width: 4, height: 16, background: '#8B5E3C' }} />
    </div>
  );
}

function GroundStrip({ colors, h }) {
  return (
    <div style={{ display: 'flex', height: h, width: '100%', flexShrink: 0 }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          flex: '1 0 0', background: colors[i % colors.length],
          boxShadow: 'inset -2px -2px 0 rgba(0,0,0,0.25), inset 2px 2px 0 rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(0,0,0,0.12)',
        }} />
      ))}
    </div>
  );
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => { const d = document.documentElement; setPct((window.scrollY / (d.scrollHeight - d.clientHeight)) * 100); };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#020c06' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#a3e635,#4ade80,#86efac)', boxShadow: '0 0 10px #4ade80', transition: 'width 0.08s linear' }} />
    </div>
  );
}

const navLinks = [
  { to: '/features',  label: 'Features'  },
  { to: '/use-cases', label: 'Use Cases' },
  { to: '/pricing',   label: 'Pricing'   },
  { to: '/about',     label: 'About'     },
];

/* ══════════════════════════════════════════════════
   LAYOUT
══════════════════════════════════════════════════ */
export default function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [viewportW, setViewportW] = useState(typeof window === 'undefined' ? 1200 : window.innerWidth);
  const isMobile = viewportW < 960;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');
        *{box-sizing:border-box;}
        body{
          margin:0;padding:0;
          background:#040d07;
          cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect x='2' y='2' width='8' height='8' fill='%234ade80'/%3E%3Crect x='10' y='10' width='8' height='8' fill='%234ade80'/%3E%3C/svg%3E") 4 4,crosshair;
        }

        /* Nav link */
        .nav-link{
          font-family:'Press Start 2P',monospace;font-size:7px;letter-spacing:1px;
          color:#2d6a3f;text-decoration:none;padding:8px 14px;
          border:2px solid transparent;transition:all 0.12s;white-space:nowrap;
        }
        .nav-link:hover{color:#4ade80;border-color:#1a4528;background:rgba(74,222,128,0.06);}
        .nav-link.active{color:#4ade80;border-color:#22c55e;background:rgba(21,128,61,0.15);}

        /* Pixel button */
        .mc-btn{
          display:inline-flex;align-items:center;gap:6px;
          font-family:'Press Start 2P',monospace;font-size:8px;letter-spacing:1px;
          padding:11px 22px;color:#fff;text-decoration:none;cursor:pointer;border:none;
          position:relative;overflow:hidden;transition:transform 0.1s,box-shadow 0.1s;
          image-rendering:pixelated;
        }
        .mc-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 50%);pointer-events:none;}
        .mc-btn:hover{transform:translate(-2px,-2px);}
        .mc-btn:active{transform:translate(2px,2px);}
        .btn-g{background:linear-gradient(180deg,#16a34a,#15803d);box-shadow:4px 4px 0 #052e16;}
        .btn-g:hover{box-shadow:6px 6px 0 #052e16;}
        .btn-ghost{background:transparent;border:2px solid #1a4528 !important;color:#4ade80 !important;box-shadow:3px 3px 0 #052e16;}
        .btn-ghost:hover{box-shadow:5px 5px 0 #052e16;background:rgba(74,222,128,0.07) !important;}

        /* Page grid */
        .pg{
          position:absolute;inset:0;
          background-image:linear-gradient(rgba(74,222,128,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.025) 1px,transparent 1px);
          background-size:40px 40px;pointer-events:none;
        }

        /* Scroll reveal */
        [data-reveal]{opacity:0;transform:translateY(30px);transition:opacity 0.7s ease,transform 0.7s ease;}
        [data-reveal].revealed{opacity:1;transform:translateY(0);}
        [data-reveal][data-d='1']{transition-delay:.08s;}[data-reveal][data-d='2']{transition-delay:.18s;}
        [data-reveal][data-d='3']{transition-delay:.28s;}[data-reveal][data-d='4']{transition-delay:.38s;}
        [data-reveal][data-d='5']{transition-delay:.48s;}[data-reveal][data-d='6']{transition-delay:.58s;}

        @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-6px) scale(1.2);}}
        @keyframes mcFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(24px);}to{opacity:1;transform:translateY(0);}}
        @keyframes neonPulse{0%,100%{text-shadow:3px 3px 0 #040d07,0 0 18px rgba(74,222,128,0.35);}50%{text-shadow:3px 3px 0 #040d07,0 0 40px rgba(74,222,128,0.8);}}
        @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
        @keyframes creeperPulse{0%,100%{filter:drop-shadow(0 0 4px #4ade80);}50%{filter:drop-shadow(0 0 14px #4ade80);}}
        @keyframes xpPop{0%,100%{transform:scale(1);}50%{transform:scale(1.2);}}
        @keyframes lootFloat{0%{opacity:1;transform:translateY(0);}100%{opacity:0;transform:translateY(-40px);}}
        @keyframes starTwinkle{0%,100%{opacity:1;}50%{opacity:0.1;}}
        @keyframes groundWiggle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1px);}}
        @keyframes rainbowBorder{
          0%{box-shadow:6px 6px 0 #052e16,0 0 20px rgba(74,222,128,0.2);}
          33%{box-shadow:6px 6px 0 #052e16,0 0 20px rgba(96,165,250,0.2);}
          66%{box-shadow:6px 6px 0 #052e16,0 0 20px rgba(167,139,250,0.2);}
          100%{box-shadow:6px 6px 0 #052e16,0 0 20px rgba(74,222,128,0.2);}
        }

        /* Feature card hover */
        .fcard{background:#0b1e10;border:3px solid #1a4528;padding:28px;position:relative;overflow:hidden;transition:all 0.18s;cursor:default;}
        .fcard::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(74,222,128,0.04) 0%,transparent 60%);pointer-events:none;}
        .fcard:hover{transform:translate(-4px,-4px);}

        /* Inventory slot */
        .inv-slot{background:#0a1a0d;border:3px solid #22c55e;box-shadow:inset -3px -3px 0 rgba(0,0,0,0.5),inset 2px 2px 0 rgba(255,255,255,0.07);}

        /* Scanline */
        .scanline{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
        .scanline::after{content:'';position:absolute;left:0;right:0;height:2px;background:rgba(74,222,128,0.05);animation:scanMove 12s linear infinite;}

        /* Footer link */
        .flink{font-family:'VT323',monospace;font-size:18px;color:#1a4a2e;text-decoration:none;transition:color 0.12s;display:block;margin-bottom:8px;}
        .flink:hover{color:#4ade80;}

        /* Section badge */
        .sec-badge{
          display:inline-flex;align-items:center;gap:8px;
          border:2px solid #22c55e;padding:5px 16px;
          font-family:'Press Start 2P',monospace;font-size:7px;color:#4ade80;letter-spacing:2px;
          background:rgba(21,128,61,0.12);box-shadow:3px 3px 0 #040d07;
        }
      `}</style>

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#040d07' }}>

        {/* ── NAVBAR ── */}
        <nav style={{
          position: 'sticky', top: 0, zIndex: 200,
          background: scrolled ? 'rgba(4,13,7,0.97)' : 'rgba(4,13,7,0.88)',
          backdropFilter: 'blur(10px)',
          borderBottom: `3px solid ${scrolled ? '#22c55e' : '#0d2a14'}`,
          boxShadow: scrolled ? '0 4px 0 #052e16, 0 0 30px rgba(74,222,128,0.08)' : 'none',
          padding: isMobile ? '0 12px' : '0 48px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all 0.2s',
        }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ animation: 'creeperPulse 2.5s ease-in-out infinite' }}>
              <CreeperIcon size={26} />
            </div>
            <div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: isMobile ? 8 : 10, color: '#4ade80', textShadow: '2px 2px 0 #052e16', lineHeight: 1 }}>
                RepoLink
              </div>
              <div style={{ fontFamily: "'VT323',monospace", fontSize: isMobile ? 12 : 14, color: '#1a4a2e', lineHeight: 1, marginTop: 3 }}>
                AI Repo Analyzer
              </div>
            </div>
          </Link>

          {/* Torch spacer left */}
          {!isMobile && <Torch style={{ marginLeft: 16 }} />}

          {/* Nav links */}
          <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}>
            {navLinks.map(({ to, label }) => (
              <NavLink key={to} to={to}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Torch spacer right */}
          {!isMobile && <Torch style={{ marginRight: 16 }} />}

          {/* CTA */}
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            {isMobile && (
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="mc-btn btn-ghost"
                style={{ fontSize: 7, padding: '8px 10px' }}
              >
                ≡
              </button>
            )}
            <Link to="/login" className="mc-btn btn-ghost" style={{ fontSize: 7, padding: '9px 18px' }}>
              Login
            </Link>
            <Link to="/signup" className="mc-btn btn-g" style={{ fontSize: 7, padding: isMobile ? '9px 12px' : '9px 18px' }}>
              ▶ Get Started
            </Link>
          </div>

          <ScrollProgress />
        </nav>
        {isMobile && menuOpen && (
          <div style={{ position: 'sticky', top: 64, zIndex: 199, background: '#040d07', borderBottom: '2px solid #1a4528', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                style={{ width: '100%', textAlign: 'center' }}
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}

        {/* ── PAGE CONTENT ── */}
        <main style={{ flex: 1 }}>
          <Outlet />
        </main>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '4px solid #22c55e', background: '#040d07', position: 'relative', overflow: 'hidden' }}>
          <div className="pg" />

          {/* Top ground strip */}
          <GroundStrip colors={['#4a8c3f', '#3a7230', '#2d5a26', '#4a8c3f']} h={10} />
          <GroundStrip colors={['#6b4226', '#8B5E3C', '#5c3d1e', '#6b4226']} h={8} />

          <div style={{ padding: isMobile ? '32px 16px 24px' : '56px 80px 40px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? 24 : 48, marginBottom: 48 }}>
              {/* Brand col */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
                  <div style={{ animation: 'creeperPulse 3s ease-in-out infinite' }}><CreeperIcon size={22} /></div>
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: '#4ade80', textShadow: '2px 2px 0 #052e16' }}>RepoLink</span>
                </div>
                <p style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: '#1a4a2e', lineHeight: 1.6, maxWidth: 260 }}>
                  Understand any codebase instantly. AI-powered call graphs, file trees, and natural language Q&A.
                </p>
                {/* XP orbs */}
                <div style={{ display: 'flex', gap: 4, marginTop: 20 }}>
                  {['#4ade80','#22c55e','#15803d','#86efac','#15803d','#22c55e','#4ade80','#a3e635'].map((c, i) => (
                    <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, boxShadow: `0 0 5px ${c}`, animation: `xpBounce 1.4s ${i * 0.12}s ease-in-out infinite` }} />
                  ))}
                </div>
              </div>

              {/* Link cols */}
              {[
                { title: 'Product',  links: [['Features','/features'],['Use Cases','/use-cases'],['Pricing','/pricing']] },
                { title: 'Company',  links: [['About','/about'],['Contact','/contact']] },
                { title: 'Legal',    links: [['Privacy','/privacy'],['Terms','/terms'],['Security','/security']] },
              ].map(({ title, links }) => (
                <div key={title}>
                  <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', marginBottom: 18, letterSpacing: 1 }}>{title}</div>
                  {links.map(([label, to]) => (
                    <Link key={to} to={to} className="flink">{label}</Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '2px solid #1a4528', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e' }}>
                © 2026 RepoLink. Built block by block.
              </span>
              <div style={{ display: 'flex', gap: 4 }}>
                {['#4ade80','#22c55e','#15803d','#86efac','#15803d','#22c55e','#4ade80'].map((c, i) => (
                  <div key={i} style={{ width: 10, height: 10, background: c, animation: `xpPop ${1.2 + i * 0.15}s ${i * 0.1}s ease-in-out infinite` }} />
                ))}
              </div>
            </div>
          </div>

          {/* Bottom ground */}
          <GroundStrip colors={['#4a8c3f', '#3a7230', '#4a8c3f']} h={10} />
          <GroundStrip colors={['#6b4226', '#8B5E3C', '#6b4226']} h={8} />
          <GroundStrip colors={['#3d2b14', '#4a3620', '#3d2b14']} h={6} />
        </footer>
      </div>
    </>
  );
}
