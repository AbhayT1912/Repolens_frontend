import { Outlet, NavLink, Link, useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { api } from '../../utils/api';

/* ══════════════════════════════════════════════════
   STYLES
══════════════════════════════════════════════════ */
const LAYOUT_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');

  @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-5px) scale(1.2);}}
  @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
  @keyframes mcFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
  @keyframes neonPulse{0%,100%{text-shadow:2px 2px 0 #040d07,0 0 10px rgba(74,222,128,0.3);}50%{text-shadow:2px 2px 0 #040d07,0 0 24px rgba(74,222,128,0.7);}}
  @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
  @keyframes creeperPulse{0%,100%{filter:drop-shadow(0 0 4px rgba(74,222,128,0.5));}50%{filter:drop-shadow(0 0 12px rgba(74,222,128,0.9));}}
  @keyframes slideIn{from{opacity:0;transform:translateX(-8px);}to{opacity:1;transform:translateX(0);}}
  @keyframes creditsPop{0%,100%{transform:scale(1);}50%{transform:scale(1.06);}}
  @keyframes creditsGlow{0%,100%{box-shadow:inset 0 0 0 transparent;}50%{box-shadow:inset 0 0 12px rgba(74,222,128,0.15);}}

  /* Sidebar nav link */
  .sidebar-link{
    display:flex;align-items:center;gap:10px;
    padding:10px 16px;
    font-family:'VT323',monospace;font-size:19px;
    text-decoration:none;color:#1a4a2e;
    border-left:3px solid transparent;
    transition:all 0.12s;
  }
  .sidebar-link:hover{color:#4ade80;background:rgba(74,222,128,0.05);}
  .sidebar-link-active{
    color:#4ade80!important;
    background:#0d2a14!important;
    border-left:3px solid #4ade80!important;
  }

  /* Sidebar section header */
  .sidebar-section{
    padding:8px 16px 10px;
    font-family:'Press Start 2P',monospace;font-size:6px;
    color:#1a4a2e;letter-spacing:1.5px;
  }

  /* Main content grid bg */
  .main-pg{
    position:fixed;inset:0;
    background-image:linear-gradient(rgba(74,222,128,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.015) 1px,transparent 1px);
    background-size:36px 36px;pointer-events:none;z-index:0;
  }
  .main-scan{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
  .main-scan::after{content:'';position:absolute;left:0;right:0;height:2px;background:rgba(74,222,128,0.025);animation:scanMove 16s linear infinite;}

  /* Scrollbar */
  aside::-webkit-scrollbar{width:4px;}
  aside::-webkit-scrollbar-track{background:#020c06;}
  aside::-webkit-scrollbar-thumb{background:#1a4528;}
  aside::-webkit-scrollbar-thumb:hover{background:#22c55e;}
`;

const SIDEBAR_W = 224;
const HEADER_H  = 56;

/* ══════════════════════════════════════════════════
   CREEPER ICON (SVG pixel art)
══════════════════════════════════════════════════ */
function CreeperIcon({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ imageRendering: 'pixelated', animation: 'creeperPulse 2.5s ease-in-out infinite', flexShrink: 0 }}>
      <rect width="16" height="16" fill="#22c55e" />
      {/* Eyes */}
      <rect x="2" y="4" width="4" height="4" fill="#040d07" />
      <rect x="10" y="4" width="4" height="4" fill="#040d07" />
      {/* Mouth */}
      <rect x="6"  y="8"  width="4" height="2" fill="#040d07" />
      <rect x="4"  y="10" width="2" height="2" fill="#040d07" />
      <rect x="10" y="10" width="2" height="2" fill="#040d07" />
      <rect x="6"  y="12" width="4" height="2" fill="#040d07" />
      {/* Edge highlight */}
      <rect x="0" y="0" width="16" height="1" fill="rgba(255,255,255,0.15)" />
      <rect x="0" y="0" width="1" height="16" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════
   TORCH (flickering)
══════════════════════════════════════════════════ */
function Torch({ style = {} }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF(x => (x + 1) % 3), 110); return () => clearInterval(id); }, []);
  const fc = ['#ff8c00', '#ff5500', '#ffaa00'][f];
  return (
    <div style={{ position: 'relative', width: 10, height: 22, flexShrink: 0, ...style }}>
      <div style={{ position: 'absolute', top: 0, left: 1, width: 8, height: 5, background: fc, boxShadow: `0 0 ${4 + f * 2}px ${fc}`, transition: 'all 0.09s' }} />
      <div style={{ position: 'absolute', top: 4, left: 3, width: 4, height: 12, background: '#8B5E3C' }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   XP ORBS
══════════════════════════════════════════════════ */
function XPOrbs({ count = 6, style = {} }) {
  return (
    <div style={{ display: 'flex', gap: 3, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: '#a3e635', boxShadow: '0 0 4px #a3e635', animation: `xpBounce 1.4s ${i * 0.12}s ease-in-out infinite`, opacity: 1 - i * 0.1 }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SIDEBAR LINK
══════════════════════════════════════════════════ */
function SidebarLink({ to, icon, label, end = false }) {
  return (
    <NavLink to={to} end={end}
      className={({ isActive }) => `sidebar-link${isActive ? ' sidebar-link-active' : ''}`}
    >
      <span style={{ width: 20, textAlign: 'center', fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
}

/* ══════════════════════════════════════════════════
   REPO SUB-NAV
══════════════════════════════════════════════════ */
function RepoSidebar({ repoId }) {
  return (
    <div style={{ marginTop: 6, borderTop: '2px solid #0d2a14', paddingTop: 6 }}>
      <div className="sidebar-section" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: '#22c55e' }}>▸</span> REPOSITORY
      </div>
      <div style={{ padding: '4px 12px 6px', marginBottom: 2 }}>
        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: 1, padding: '4px 6px', background: '#020c06', border: '1px solid #1a4528' }}>
          {repoId?.replace(/-/g, '/')}
        </div>
      </div>
      <SidebarLink to={`/${repoId}`}            end icon="" label="Overview"   />
      <SidebarLink to={`/${repoId}/structure`}      icon="" label="Structure"  />
      <SidebarLink to={`/${repoId}/graph`}          icon="" label="Call Graph" />
      <SidebarLink to={`/${repoId}/analytics`}      icon="" label="Analytics"  />
      <SidebarLink to={`/${repoId}/ask`}            icon="" label="Ask AI"     />
      <SidebarLink to={`/${repoId}/history`}        icon="" label="History"    />
      <SidebarLink to={`/${repoId}/pr-analysis`}        icon="" label="PR Analysis"    />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   GROUND STRIP (sidebar footer decoration)
══════════════════════════════════════════════════ */
function GroundStrip() {
  return (
    <div style={{ display: 'flex', overflow: 'hidden', height: 8 }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{ flex: 1, background: i % 3 === 0 ? '#15803d' : i % 3 === 1 ? '#166534' : '#14532d', boxShadow: 'inset 0 -2px rgba(0,0,0,0.3)', borderRight: '1px solid rgba(0,0,0,0.1)' }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SCROLL PROGRESS BAR (header)
══════════════════════════════════════════════════ */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el  = document.getElementById('main-scroll');
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    const el = document.getElementById('main-scroll');
    el?.addEventListener('scroll', onScroll);
    return () => el?.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{ position: 'absolute', bottom: -2, left: 0, right: 0, height: 3, background: '#0d2a14' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#15803d,#4ade80)', boxShadow: '0 0 6px #4ade8066', transition: 'width 0.1s linear' }} />
    </div>
  );
}

/* ══════════════════════════════════════════════════
   BREADCRUMB
══════════════════════════════════════════════════ */
function Breadcrumb({ repoId }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'VT323',monospace", fontSize: 18 }}>
      <Link to="/dashboard" style={{ color: '#1a4a2e', textDecoration: 'none', transition: 'color 0.12s' }}
        onMouseOver={e => e.currentTarget.style.color = '#4ade80'}
        onMouseOut={e => e.currentTarget.style.color = '#1a4a2e'}
      >
        REPOLINK
      </Link>
      <span style={{ color: '#0d2a14', fontFamily: "'Press Start 2P',monospace", fontSize: 7 }}>/</span>
      {repoId ? (
        <>
          <span style={{ color: '#2d6a3f' }}>{repoId.replace(/-/g, '/')}</span>
        </>
      ) : (
        <span style={{ color: '#2d6a3f' }}>WORKSPACE</span>
      )}
      <span style={{ animation: 'mcBlink 1.2s step-end infinite', color: '#22c55e', fontFamily: "'Press Start 2P',monospace", fontSize: 8, marginLeft: 2 }}>█</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   CREDITS BADGE
══════════════════════════════════════════════════ */
function CreditsBadge({ credits = 0, creditsLimit = 500 }) {
  const [hov, setHov] = useState(false);
  const pct = creditsLimit > 0 ? (credits / creditsLimit) * 100 : 0;
  return (
    <div
      onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, padding: '7px 14px',
        background: hov ? '#0d2a14' : '#020c06',
        border: `2px solid ${hov ? '#22c55e' : '#1a4528'}`,
        boxShadow: hov ? '0 0 12px rgba(74,222,128,0.2)' : 'none',
        transition: 'all 0.15s', cursor: 'default', position: 'relative',
      }}
    >
      <span style={{ fontSize: 14, animation: 'xpBounce 2s ease-in-out infinite' }}>⚡</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: '#4ade80', textShadow: '1px 1px 0 #040d07' }}>{credits}</span>
          <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e' }}>/ {creditsLimit}</span>
        </div>
        {/* Mini seg bar */}
        <div style={{ display: 'flex', gap: 1.5, marginTop: 4 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ width: 6, height: 4, background: i < Math.round((pct / 100) * 12) ? '#22c55e' : '#0d2a14', boxShadow: i < Math.round((pct / 100) * 12) ? '0 0 3px #22c55e88' : 'none' }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   USER CARD (sidebar bottom)
══════════════════════════════════════════════════ */
function UserCard({ user, onSignOut }) {
  const displayName  = user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Player';
  const avatarLetter = displayName[0]?.toUpperCase() ?? '?';
  const avatarUrl    = user?.imageUrl;

  return (
    <div style={{ borderTop: '3px solid #1a4528', background: '#020c06' }}>
      <GroundStrip />
      <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Avatar */}
        {avatarUrl ? (
          <img src={avatarUrl} alt={displayName}
            style={{ width: 32, height: 32, flexShrink: 0, border: '2px solid #22c55e', objectFit: 'cover', imageRendering: 'auto', boxShadow: '0 0 8px rgba(74,222,128,0.3)' }}
          />
        ) : (
          <div style={{ width: 32, height: 32, flexShrink: 0, background: '#0d2a14', border: '2px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Press Start 2P',monospace", fontSize: 11, color: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.3)' }}>
            {avatarLetter}
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#4ade80', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', letterSpacing: 1, marginBottom: 3 }}>
            {displayName.length > 14 ? displayName.slice(0, 13) + '…' : displayName}
          </div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#1a4a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.primaryEmailAddress?.emailAddress ?? ''}
          </div>
        </div>

        {/* Sign out button */}
        <button onClick={onSignOut} title="Sign out"
          style={{ background: 'transparent', border: '2px solid #1a4528', color: '#1a4a2e', cursor: 'pointer', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0, transition: 'all 0.12s' }}
          onMouseOver={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.color = '#1a4a2e'; }}
        >
          ⏏
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   COMMAND CONSOLE (JSON Visualization)
══════════════════════════════════════════════════ */
function CommandConsole({ logs, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 20, right: 20, width: 'min(450px,95vw)', height: 'min(500px,70vh)',
      background: '#0b1e10', border: '4px solid #1a4528', zIndex: 1000,
      display: 'flex', flexDirection: 'column', boxShadow: '8px 8px 0 #040d07',
      animation: 'slideIn 0.3s ease both',
    }}>
      <div style={{
        padding: '12px 16px', background: '#020c06', borderBottom: '3px solid #1a4528',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 12, height: 12, background: '#a78bfa', boxShadow: '0 0 8px #a78bfa' }} />
          <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#a78bfa' }}>COMMAND_BLOCK.SYS</span>
        </div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#1a4a2e', cursor: 'pointer', fontFamily: "'Press Start 2P',monospace", fontSize: 10 }}>[X]</button>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, background: '#020c06' }}>
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: 100, color: '#1a4a2e', fontFamily: "'VT323',monospace", fontSize: 20 }}>
            Waiting for signals...<span style={{ animation: 'mcBlink 1s step-end infinite' }}>█</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 16 }}>
            {logs.map((log, i) => (
              <div key={i} style={{ border: `2px solid ${log.success ? '#22c55e33' : '#ef444433'}`, background: '#0b1e10', padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: log.success ? '#4ade80' : '#f87171' }}>
                    {log.method} {log.endpoint}
                  </span>
                  <span style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#1a4a2e' }}>{log.timestamp}</span>
                </div>
                <div style={{ background: '#020c06', padding: 10, overflowX: 'auto' }}>
                  <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: 12, color: log.success ? '#86efac' : '#f87171' }}>
                    {JSON.stringify(log.responseData || { error: log.error }, null, 2)}
                  </pre>
                </div>
                {log.duration && (
                  <div style={{ textAlign: 'right', marginTop: 4, fontFamily: "'VT323',monospace", fontSize: 12, color: '#1a4a2e' }}>
                    Latency: {log.duration}ms
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ padding: '8px 12px', background: '#0d2a14', borderTop: '3px solid #1a4528', fontFamily: "'VT323',monospace", fontSize: 14, color: '#4ade80' }}>
        Listening on: {import.meta.env.VITE_API_URL}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   APP LAYOUT
══════════════════════════════════════════════════ */
export default function AppLayout() {
  const { repoId }   = useParams();
  const navigate     = useNavigate();
  const { user }     = useUser();
  const { signOut }  = useClerk();
  const [collapsed, setCollapsed] = useState(false);
  const [viewportW, setViewportW] = useState(typeof window === 'undefined' ? 1200 : window.innerWidth);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [apiLogs, setApiLogs] = useState([]);
  const [summary, setSummary] = useState({
    credits_left: 0,
    credits_limit: 500,
  });

  useEffect(() => {
    const unsubscribe = api.subscribe((log) => {
      setApiLogs(prev => [log, ...prev].slice(0, 50));
      // Auto-open console on error
      if (!log.success) setConsoleOpen(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchSummary = async () => {
      try {
        const res = await api.get('/dashboard-summary');
        if (!mounted) return;
        setSummary({
          credits_left: res?.data?.credits_left ?? 0,
          credits_limit: res?.data?.credits_limit ?? 500,
        });
      } catch (_) {
        if (!mounted) return;
        setSummary({
          credits_left: 0,
          credits_limit: 500,
        });
      }
    };

    fetchSummary();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const onResize = () => setViewportW(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isMobile = viewportW < 1024;
  const sidebarWidth = isMobile ? 56 : (collapsed ? 56 : SIDEBAR_W);

  return (
    <>
      <style>{LAYOUT_CSS}</style>
      <div className="main-pg" /><div className="main-scan" />

      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>

        {/* ══ SIDEBAR ══ */}
        <aside style={{
          width: sidebarWidth, background: '#040d07',
          borderRight: '3px solid #1a4528',
          display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, left: 0, bottom: 0,
          zIndex: 50, overflowY: 'auto', overflowX: 'hidden',
          transition: 'width 0.2s ease',
        }}>

          {/* Logo */}
          <div style={{ padding: '18px 14px 14px', borderBottom: '3px solid #1a4528', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flex: 1, minWidth: 0 }}>
              <CreeperIcon size={28} />
              {!collapsed && (
                <div>
                  <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: '#4ade80', textShadow: '2px 2px 0 #052e16', animation: 'neonPulse 3s ease-in-out infinite', letterSpacing: 1 }}>
                    RepoLens
                  </div>
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#1a4a2e' }}>
                    AI Analyzer
                  </div>
                </div>
              )}
            </Link>
            {/* Collapse toggle */}
            <button onClick={() => setCollapsed(c => !c)}
              style={{ background: 'transparent', border: '2px solid #1a4528', color: '#1a4a2e', cursor: 'pointer', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, flexShrink: 0, fontFamily: "'Press Start 2P',monospace", transition: 'all 0.12s' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#4ade80'; e.currentTarget.style.color = '#4ade80'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.color = '#1a4a2e'; }}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? '»' : '«'}
            </button>
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, paddingTop: 10 }}>
  {!collapsed && !isMobile && (
    <div className="sidebar-section">
      <span style={{ color: '#22c55e' }}>▸</span> WORKSPACE
    </div>
  )}

  <SidebarLink to="/dashboard" end icon="" label={collapsed || isMobile ? '' : 'Dashboard'} />
  <SidebarLink to="/analyze"       icon="" label={collapsed || isMobile ? '' : 'Analyze Repo'} />

  {repoId && !collapsed && !isMobile && <RepoSidebar repoId={repoId} />}

  <div style={{ height: 12 }} />

  {!collapsed && !isMobile && (
    <>
      <div style={{ height: 2, background: '#0d2a14', margin: '4px 16px' }} />
      <div className="sidebar-section">
        <span style={{ color: '#22c55e' }}>▸</span> ACCOUNT
      </div>
    </>
  )}

  <SidebarLink to="/profile"  icon="" label={collapsed || isMobile ? '' : 'Profile'} />
  <SidebarLink to="/settings" icon=""  label={collapsed || isMobile ? '' : 'Settings'} />
</nav>

          {/* XP orbs above user card (only when expanded) */}
          {!collapsed && !isMobile && (
            <div style={{ padding: '8px 14px 0' }}>
              <XPOrbs count={7} />
            </div>
          )}

          {/* User card */}
          {!collapsed && !isMobile ? (
            <UserCard user={user} onSignOut={handleSignOut} />
          ) : (
            <div style={{ borderTop: '3px solid #1a4528', padding: '10px', display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleSignOut} title="Sign out"
                style={{ background: 'transparent', border: '2px solid #1a4528', color: '#1a4a2e', cursor: 'pointer', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, transition: 'all 0.12s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.color = '#1a4a2e'; }}
              >
                ⏏
              </button>
            </div>
          )}
        </aside>

        {/* ══ MAIN AREA ══ */}
        <div style={{ marginLeft: sidebarWidth, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', transition: 'margin-left 0.2s ease' }}>

          {/* Header */}
          <header style={{
            height: HEADER_H, background: '#040d07',
            borderBottom: '3px solid #1a4528',
            padding: isMobile ? '0 10px' : '0 28px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, zIndex: 40,
          }}>
            <ScrollProgress />

            <div style={{ flex: 1, minWidth: 0 }}>
              <Breadcrumb repoId={repoId} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {viewportW >= 760 && <CreditsBadge
                credits={summary.credits_left}
                creditsLimit={summary.credits_limit}
              />}

              {!isMobile && <Link to="/analyze" style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'Press Start 2P',monospace", fontSize: 7, letterSpacing: 1,
                padding: '9px 16px', color: '#fff', textDecoration: 'none',
                background: 'linear-gradient(180deg,#16a34a,#15803d)',
                border: '3px solid #22c55e', boxShadow: '3px 3px 0 #052e16',
                transition: 'all 0.1s', position: 'relative', overflow: 'hidden',
              }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '5px 5px 0 #052e16'; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #052e16'; }}
              >
                <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,0.1) 0%,transparent 50%)', pointerEvents: 'none' }} />
                + NEW REPO
              </Link>}

              <button 
                onClick={() => setConsoleOpen(!consoleOpen)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: "'Press Start 2P',monospace", fontSize: 7, letterSpacing: 1,
                  padding: '9px 12px', color: consoleOpen ? '#4ade80' : '#1a4a2e',
                  background: '#020c06', border: '3px solid #1a4528',
                  boxShadow: '3px 3px 0 #040d07', cursor: 'pointer', transition: 'all 0.1s'
                }}
              >
                📟 LOGS {apiLogs.length > 0 && <span style={{ color: '#fbbf24' }}>({apiLogs.length})</span>}
              </button>
            </div>
          </header>

          {/* Page content */}
          <main id="main-scroll" style={{
            flex: 1, background: '#040d07',
            overflowX: 'hidden', overflowY: 'auto',
            position: 'relative',
          }}>
            <Outlet />
          </main>
        </div>
      </div>

      <CommandConsole 
        logs={apiLogs} 
        isOpen={consoleOpen} 
        onClose={() => setConsoleOpen(false)} 
      />
    </>
  );
}
