import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { useEffect, useState } from 'react';
import { api } from '../../utils/api';

/* ══════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════ */
const LANG_COLORS = {
  JavaScript: '#fbbf24',
  TypeScript: '#60a5fa',
  Rust:       '#f97316',
  Go:         '#34d399',
  Python:     '#a78bfa',
};

const formatRelativeTime = (isoDate) => {
  if (!isoDate) return 'N/A';
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  if (diffMs < 60 * 1000) return 'just now';
  if (diffMs < 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 1000))}m ago`;
  if (diffMs < 24 * 60 * 60 * 1000) return `${Math.floor(diffMs / (60 * 60 * 1000))}h ago`;
  return `${Math.floor(diffMs / (24 * 60 * 60 * 1000))}d ago`;
};

const getRepoName = (repo) => {
  if (repo?.repo_name) return repo.repo_name;
  if (repo?.repo_url) {
    const cleaned = String(repo.repo_url).replace(/\/+$/, '');
    const segments = cleaned.split('/');
    if (segments.length >= 2) {
      return `${segments[segments.length - 2]}/${segments[segments.length - 1]}`;
    }
  }
  return 'unknown/repository';
};

const QUICK_ACTIONS = [
  { to: '/analyze', icon: '', label: 'Analyze New Repo',  color: '#4ade80' },
  { to: '/profile',  icon: '', label: 'Edit Profile',      color: '#60a5fa' },
  { to: '/settings', icon: '',  label: 'Account Settings',  color: '#a78bfa' },
];

/* ══════════════════════════════════════════════════
   PIXEL ATOMS
══════════════════════════════════════════════════ */
function DiamondOre({ size = 36 }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const id = setInterval(() => setPhase(p => (p + 1) % 4), 500); return () => clearInterval(id); }, []);
  const glows = ['drop-shadow(0 0 3px #00d4ff)', 'drop-shadow(0 0 8px #00d4ff)', 'drop-shadow(0 0 5px #00eeff)', 'drop-shadow(0 0 3px #00d4ff)'];
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" style={{ imageRendering: 'pixelated', filter: glows[phase], transition: 'filter 0.4s' }}>
      <rect width="12" height="12" fill="#7a7a7a" />
      <rect x="1" y="1" width="10" height="10" fill="#8a8a8a" />
      <rect x="2" y="2" width="8" height="8" fill="#7a7a7a" />
      <rect x="2" y="3" width="2" height="2" fill="#00d4ff" />
      <rect x="7" y="5" width="3" height="2" fill="#00d4ff" />
      <rect x="4" y="7" width="2" height="2" fill="#00d4ff" />
      <rect x="3" y="3" width="1" height="1" fill="#aaffff" />
    </svg>
  );
}

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

function XPOrbs({ count = 8, style = {} }) {
  return (
    <div style={{ display: 'flex', gap: 4, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: 8, height: 8, borderRadius: '50%',
          background: '#a3e635', boxShadow: '0 0 5px #a3e635',
          animation: `xpBounce 1.4s ${i * 0.1}s ease-in-out infinite`,
          opacity: 1 - i * 0.09,
        }} />
      ))}
    </div>
  );
}

function SegBar({ value, max = 100, color, segments = 16 }) {
  const filled = Math.round((value / max) * segments);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 8,
          background: i < filled ? color : '#0d2a14',
          boxShadow: i < filled ? `0 0 4px ${color}88` : 'none',
        }} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════
   STAT CARD
══════════════════════════════════════════════════ */
function McStatCard({ icon, label, value, sub, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      style={{
        background: '#0b1e10',
        border: `3px solid ${hovered ? color : '#1a4528'}`,
        padding: '22px 20px',
        position: 'relative', overflow: 'hidden',
        boxShadow: hovered ? `6px 6px 0 #040d07, 0 0 22px ${color}33` : '4px 4px 0 #040d07',
        transform: hovered ? 'translate(-3px,-3px)' : 'none',
        transition: 'all 0.18s', cursor: 'default',
      }}
    >
      {/* corner pip */}
      <div style={{ position: 'absolute', top: -4, right: -4, width: 14, height: 14, background: color, boxShadow: `0 0 8px ${color}99` }} />
      {/* bg glow */}
      <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg,${color}08 0%,transparent 60%)`, pointerEvents: 'none' }} />

      <div style={{ fontSize: 26, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 20, color, textShadow: `2px 2px 0 #040d07`, marginBottom: 6 }}>
        {value}
      </div>
      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#2d6a3f', letterSpacing: 1, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#1a4a2e' }}>{sub}</div>

      {/* Mini seg bar */}
      <div style={{ marginTop: 12 }}>
        <SegBar value={parseInt(value) || 50} max={parseInt(value) * 1.3 || 100} color={color} segments={12} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   REPO ROW
══════════════════════════════════════════════════ */
function RepoRow({ id, name, lang, stars, files, analyzed, status }) {
  const [hovered, setHovered] = useState(false);
  const lc = LANG_COLORS[lang] || '#4ade80';
  const initial = name.split('/')[0][0]?.toUpperCase() ?? '?';
  return (
    <Link to={`/${id}/history`} style={{ textDecoration: 'none' }}>
      <div
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
        style={{
          background: '#0b1e10',
          border: `3px solid ${hovered ? '#22c55e' : '#1a4528'}`,
          padding: '14px 18px',
          display: 'flex', alignItems: 'center', gap: 14,
          boxShadow: hovered ? '6px 6px 0 #040d07, 0 0 18px rgba(74,222,128,0.15)' : '3px 3px 0 #040d07',
          transform: hovered ? 'translate(-3px,-3px)' : 'none',
          transition: 'all 0.15s', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        }}
      >
        {/* Left accent */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: hovered ? lc : '#1a4528', transition: 'background 0.15s' }} />

        {/* Avatar block */}
        <div style={{
          width: 38, height: 38, flexShrink: 0, marginLeft: 6,
          background: '#020c06', border: `2px solid ${lc}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Press Start 2P',monospace", fontSize: 13, color: lc,
          boxShadow: `inset -2px -2px 0 rgba(0,0,0,0.5), 0 0 8px ${lc}33`,
        }}>
          {initial}
        </div>

        {/* Name + meta */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#86efac', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {name}
          </div>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: lc }}>● {lang}</span>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#1a4a2e' }}>⭐ {stars}</span>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#1a4a2e' }}>🗂 {files.toLocaleString()} files</span>
          </div>
        </div>

        {/* Status + time */}
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{
            display: 'inline-block',
            fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#4ade80',
            border: '2px solid #22c55e', padding: '3px 8px',
            background: 'rgba(74,222,128,0.1)', marginBottom: 6,
          }}>
            ✓ {status}
          </div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#1a4a2e' }}>{analyzed}</div>
        </div>

        {/* Arrow */}
        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 10, color: hovered ? '#4ade80' : '#1a4528', transition: 'color 0.15s, transform 0.15s', transform: hovered ? 'translateX(3px)' : 'none' }}>
          →
        </div>
      </div>
    </Link>
  );
}

/* ══════════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════════ */
export default function Dashboard() {
  const { user } = useUser();
  const firstName = user?.firstName || user?.username || 'Miner';
  const [repos, setRepos] = useState([]);
  const [summary, setSummary] = useState({
    repos_analyzed: 0,
    analyses_saved: 0,
    ai_tokens_used: 0,
    credits_left: 0,
    credits_used: 0,
    credits_limit: 500,
  });

  useEffect(() => {
    let mounted = true;

    const fetchDashboard = async () => {
      try {
        const [reposRes, summaryRes] = await Promise.all([
          api.get('/my-repos'),
          api.get('/dashboard-summary'),
        ]);

        if (!mounted) return;

        setRepos(reposRes?.data || []);
        setSummary(summaryRes?.data || {
          repos_analyzed: 0,
          analyses_saved: 0,
          ai_tokens_used: 0,
          credits_left: 0,
          credits_used: 0,
          credits_limit: 500,
        });
      } catch (error) {
        if (!mounted) return;
        setRepos([]);
      }
    };

    fetchDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = [
    {
      icon: '',
      label: 'Repos Analyzed',
      value: String(summary.repos_analyzed ?? 0),
      sub: 'across your account',
      color: '#4ade80',
    },
    {
      icon: '',
      label: 'AI Tokens',
      value: String(summary.ai_tokens_used ?? 0),
      sub: 'total AI usage',
      color: '#60a5fa',
    },
    {
      icon: '',
      label: 'Credits Left',
      value: String(summary.credits_left ?? 0),
      sub: `of ${summary.credits_limit ?? 500} available`,
      color: '#fbbf24',
    },
    {
      icon: '',
      label: 'Analyses Saved',
      value: String(summary.analyses_saved ?? 0),
      sub: 'total history',
      color: '#a78bfa',
    },
  ];

  const activity = repos.slice(0, 4).map((repo, index) => ({
    icon: '🔍',
    text: `Analyzed ${getRepoName(repo)}`,
    time: formatRelativeTime(repo.analyzed_at),
    color: ['#4ade80', '#60a5fa', '#f87171', '#fbbf24'][index % 4],
  }));

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');
        @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-6px) scale(1.2);}}
        @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes mcFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
        @keyframes neonPulse{0%,100%{text-shadow:3px 3px 0 #040d07,0 0 15px rgba(74,222,128,0.3);}50%{text-shadow:3px 3px 0 #040d07,0 0 35px rgba(74,222,128,0.7);}}
        @keyframes xpPop{0%,100%{transform:scale(1);}50%{transform:scale(1.18);}}
        @keyframes creeperPulse{0%,100%{filter:drop-shadow(0 0 4px #4ade80);}50%{filter:drop-shadow(0 0 14px #4ade80);}}
        @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
        @keyframes starTwinkle{0%,100%{opacity:1;}50%{opacity:0.1;}}
        @keyframes actIn{from{opacity:0;transform:translateX(-12px);}to{opacity:1;transform:translateX(0);}}

        .pg{position:absolute;inset:0;background-image:linear-gradient(rgba(74,222,128,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.025) 1px,transparent 1px);background-size:36px 36px;pointer-events:none;}
        .scanline{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
        .scanline::after{content:'';position:absolute;left:0;right:0;height:2px;background:rgba(74,222,128,0.04);animation:scanMove 14s linear infinite;}
      `}</style>

      <div style={{ background: '#040d07', minHeight: '100%', position: 'relative', padding: 'clamp(14px,3vw,32px)' }}>
        <div className="pg" />
        <div className="scanline" />

        {/* ── WELCOME HEADER ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14,
          marginBottom: 36, position: 'relative', zIndex: 2,
          animation: 'fadeUp 0.5s ease both',
        }}>
          <div>
            {/* Section label */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 12,
              border: '2px solid #22c55e', padding: '4px 14px',
              fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#4ade80', letterSpacing: 2,
              background: 'rgba(21,128,61,0.12)', boxShadow: '3px 3px 0 #040d07',
            }}>
              <Torch />
              WORKSPACE
              <Torch />
            </div>

            <h1 style={{
              fontFamily: "'Press Start 2P',monospace",
              fontSize: 'clamp(12px,1.8vw,18px)',
              color: '#4ade80',
              animation: 'neonPulse 3s ease-in-out infinite',
              lineHeight: 1.6, marginBottom: 8,
            }}>
              DASHBOARD
            </h1>
            <p style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#2d6a3f' }}>
              Welcome back, <span style={{ color: '#86efac', fontFamily: "'Press Start 2P',monospace", fontSize: 9 }}>{firstName}</span>.
              You have <span style={{ color: '#fbbf24' }}>{summary.credits_left ?? 0}</span> credits remaining.
              <span style={{ animation: 'mcBlink 0.9s step-end infinite', color: '#4ade80', marginLeft: 2 }}>█</span>
            </p>
          </div>

          {/* Analyze CTA */}
          <Link to="/analyze" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: "'Press Start 2P',monospace", fontSize: 8, letterSpacing: 1,
            padding: '13px 24px', color: '#fff', textDecoration: 'none',
            background: 'linear-gradient(180deg,#16a34a,#15803d)',
            border: '3px solid #22c55e', boxShadow: '5px 5px 0 #052e16',
            transition: 'all 0.1s', position: 'relative', overflow: 'hidden',
            flexShrink: 0,
          }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = '7px 7px 0 #052e16'; }}
            onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '5px 5px 0 #052e16'; }}
          >
            <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(255,255,255,0.1) 0%,transparent 50%)', pointerEvents: 'none' }} />
            + Analyze New Repo
          </Link>
        </div>

        {/* ── STAT CARDS ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 18,
          marginBottom: 36, position: 'relative', zIndex: 2,
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{ animation: `fadeUp 0.5s ${0.05 + i * 0.08}s ease both` }}>
              <McStatCard {...s} />
            </div>
          ))}
        </div>

        {/* ── MAIN GRID ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, position: 'relative', zIndex: 2 }}>

          {/* ── REPOS TABLE ── */}
          <div style={{ animation: 'fadeUp 0.5s 0.35s ease both' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', letterSpacing: 2, marginBottom: 4 }}>
                  ▸ YOUR REPOSITORIES
                </div>
                <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#1a4a2e' }}>Recently analyzed codebases</div>
              </div>
              <DiamondOre size={32} />
            </div>

            {/* Repo rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {repos.map((r, i) => (
                <div key={r.repo_id || i} style={{ animation: `fadeUp 0.4s ${0.4 + i * 0.07}s ease both` }}>
                  <RepoRow
                    id={r.repo_id}
                    name={getRepoName(r)}
                    lang="TypeScript"
                    stars="--"
                    files={0}
                    analyzed={formatRelativeTime(r.analyzed_at)}
                    status={r.latest_version ? `v${r.latest_version}` : 'ready'}
                  />
                </div>
              ))}
              {repos.length === 0 && (
                <div style={{ background: '#0b1e10', border: '3px solid #1a4528', padding: '14px 18px', boxShadow: '3px 3px 0 #040d07', fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e' }}>
                  No analyzed repositories yet. Start with "Analyze New Repo".
                </div>
              )}
            </div>

            {/* XP orb row at bottom */}
            <XPOrbs count={10} style={{ marginTop: 18 }} />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22, animation: 'fadeUp 0.5s 0.4s ease both' }}>

            {/* Activity feed */}
            <div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', letterSpacing: 2, marginBottom: 14 }}>
                ▸ RECENT ACTIVITY
              </div>
              <div style={{ background: '#0b1e10', border: '3px solid #1a4528', overflow: 'hidden', boxShadow: '4px 4px 0 #040d07' }}>
                {activity.map(({ icon, text, time, color }, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                    padding: '13px 16px',
                    borderBottom: i < activity.length - 1 ? '2px solid #0d2a14' : 'none',
                    position: 'relative', overflow: 'hidden',
                    animation: `actIn 0.4s ${0.5 + i * 0.1}s ease both`,
                    transition: 'background 0.15s',
                  }}
                    onMouseOver={e => e.currentTarget.style.background = '#0d2a14'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Left color accent */}
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: color }} />

                    <div style={{
                      width: 30, height: 30, flexShrink: 0,
                      background: '#020c06', border: `2px solid ${color}44`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, marginLeft: 6,
                    }}>
                      {icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#2d6a3f', marginBottom: 3, lineHeight: 1.4 }}>{text}</div>
                      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e' }}>{time}</div>
                    </div>
                  </div>
                ))}
                {activity.length === 0 && (
                  <div style={{ padding: '16px', fontFamily: "'VT323',monospace", fontSize: 17, color: '#1a4a2e' }}>
                    No recent repository activity yet.
                  </div>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div>
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#22c55e', letterSpacing: 2, marginBottom: 14 }}>
                ▸ QUICK ACTIONS
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {QUICK_ACTIONS.map(({ to, icon, label, color }, i) => (
                  <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      background: '#0b1e10', border: '3px solid #1a4528',
                      padding: '12px 16px', transition: 'all 0.15s',
                      boxShadow: '3px 3px 0 #040d07', position: 'relative', overflow: 'hidden',
                      animation: `fadeUp 0.4s ${0.55 + i * 0.08}s ease both`,
                    }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = `5px 5px 0 #040d07, 0 0 14px ${color}33`; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = '#1a4528'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 #040d07'; }}
                    >
                      <div style={{
                        width: 30, height: 30, flexShrink: 0,
                        background: '#020c06', border: `2px solid ${color}55`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                      }}>
                        {icon}
                      </div>
                      <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color, letterSpacing: 1 }}>{label}</span>
                      <span style={{ marginLeft: 'auto', fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#1a4a2e' }}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Credits card */}
            <div style={{
              background: '#0b1e10', border: '3px solid #1a4528',
              padding: '20px', boxShadow: '4px 4px 0 #040d07', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, background: '#fbbf24', boxShadow: '0 0 8px #fbbf2499' }} />
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#fbbf24', letterSpacing: 1, marginBottom: 14 }}>
                ⚡ CREDITS USAGE
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#2d6a3f' }}>Monthly allowance</span>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#fbbf24' }}>
                  {summary.credits_left ?? 0} / {summary.credits_limit ?? 500}
                </span>
              </div>
              {/* Segmented credits bar */}
              <SegBar value={summary.credits_left ?? 0} max={summary.credits_limit ?? 500} color="#fbbf24" segments={20} />
              <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#1a4a2e', marginTop: 8, textAlign: 'right' }}>
                Resets in 24 hours.
              </div>
              <Link to="/pricing" style={{
                display: 'block', textAlign: 'center', marginTop: 14,
                fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#fbbf24',
                border: '2px solid #fbbf2444', padding: '8px',
                background: 'rgba(251,191,36,0.06)', textDecoration: 'none',
                transition: 'all 0.15s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#fbbf24'; e.currentTarget.style.background = 'rgba(251,191,36,0.12)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = '#fbbf2444'; e.currentTarget.style.background = 'rgba(251,191,36,0.06)'; }}
              >
                ↑ Upgrade Plan
              </Link>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

