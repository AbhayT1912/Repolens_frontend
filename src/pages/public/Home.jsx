import { Link } from 'react-router-dom';
import { CreeperIcon, StatCard, PixelDivider } from '../../components/ui';
import { useEffect, useRef, useState } from 'react';

/* ═══════════════════════════════════════════════════════════
   HOOKS
═══════════════════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ═══════════════════════════════════════════════════════════
   SCROLL PROGRESS BAR
═══════════════════════════════════════════════════════════ */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const h = () => { const d = document.documentElement; setPct((window.scrollY / (d.scrollHeight - d.clientHeight)) * 100); };
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 8, zIndex: 9999, background: '#040d07', borderBottom: '2px solid #052e16' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg,#a3e635,#4ade80,#86efac)', boxShadow: '0 0 16px #4ade80, 0 0 32px #22c55e', transition: 'width 0.08s linear' }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PIXEL ART ENTITIES
═══════════════════════════════════════════════════════════ */

// Steve - walking animation
function Steve({ size = 48, style = {} }) {
  const [frame, setFrame] = useState(0);
  useEffect(() => { const id = setInterval(() => setFrame(f => (f + 1) % 4), 200); return () => clearInterval(id); }, []);
  const legAngles = [[8, -8], [4, -4], [-8, 8], [-4, 4]];
  const [lA, rA] = legAngles[frame];
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 12 20" style={{ imageRendering: 'pixelated', ...style }}>
      {/* Hair */}
      <rect x="2" y="0" width="8" height="2" fill="#5c3d1e" />
      {/* Head */}
      <rect x="2" y="1" width="8" height="7" fill="#c8a96e" />
      <rect x="2" y="1" width="8" height="2" fill="#8B6040" />
      {/* Eyes */}
      <rect x="3" y="3" width="2" height="2" fill="#fff" />
      <rect x="7" y="3" width="2" height="2" fill="#fff" />
      <rect x="4" y="4" width="1" height="1" fill="#1a1a4a" />
      <rect x="8" y="4" width="1" height="1" fill="#1a1a4a" />
      {/* Mouth */}
      <rect x="4" y="6" width="4" height="1" fill="#a0522d" />
      {/* Body - blue shirt */}
      <rect x="3" y="8" width="6" height="6" fill="#3a6bc9" />
      <rect x="3" y="9" width="6" height="1" fill="#2d55a0" />
      <rect x="3" y="11" width="6" height="1" fill="#2d55a0" />
      {/* Arms */}
      <rect x="0" y="8" width="3" height="6" fill="#c8a96e" />
      <rect x="9" y="8" width="3" height="6" fill="#c8a96e" />
      {/* Legs */}
      <g style={{ transformOrigin: '5px 14px', transform: `rotate(${lA}deg)` }}>
        <rect x="3" y="14" width="3" height="5" fill="#4a3728" />
        <rect x="3" y="18" width="4" height="2" fill="#2a1f14" />
      </g>
      <g style={{ transformOrigin: '7px 14px', transform: `rotate(${rA}deg)` }}>
        <rect x="6" y="14" width="3" height="5" fill="#4a3728" />
        <rect x="5" y="18" width="4" height="2" fill="#2a1f14" />
      </g>
    </svg>
  );
}

// Creeper - animated glow
function CreepFace({ size = 64, style = {} }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 16 20" style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="1" y="0" width="14" height="14" fill="#4a8c3f" />
      {/* Texture spots */}
      <rect x="1" y="0" width="3" height="3" fill="#3a7230" />
      <rect x="12" y="0" width="3" height="3" fill="#3a7230" />
      <rect x="4" y="4" width="2" height="2" fill="#5aac4a" />
      <rect x="10" y="2" width="2" height="2" fill="#3a7230" />
      {/* Eyes */}
      <rect x="3" y="3" width="3" height="3" fill="#1a3d18" />
      <rect x="10" y="3" width="3" height="3" fill="#1a3d18" />
      {/* Nose mouth pattern */}
      <rect x="6" y="7" width="4" height="2" fill="#1a3d18" />
      <rect x="4" y="9" width="3" height="3" fill="#1a3d18" />
      <rect x="9" y="9" width="3" height="3" fill="#1a3d18" />
      <rect x="6" y="11" width="4" height="1" fill="#1a3d18" />
      {/* Body */}
      <rect x="4" y="14" width="8" height="6" fill="#4a8c3f" />
      <rect x="4" y="16" width="8" height="1" fill="#3a7230" />
      {/* Legs */}
      <rect x="3" y="17" width="4" height="3" fill="#3a7230" />
      <rect x="9" y="17" width="4" height="3" fill="#3a7230" />
    </svg>
  );
}

// Chest with opening lid + loot particles
function Chest({ size = 56, style = {} }) {
  const [open, setOpen] = useState(false);
  const [loot, setLoot] = useState([]);
  useEffect(() => {
    const id = setInterval(() => {
      setOpen(true);
      setLoot(['💎', '⚔️', '🪙', '✨', '🏆']);
      setTimeout(() => { setOpen(false); setLoot([]); }, 1500);
    }, 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: 'relative', width: size, height: size * 1.1, ...style }}>
      {/* Loot particles */}
      {loot.map((item, i) => (
        <div key={i} style={{
          position: 'absolute', fontSize: 12, bottom: size * 0.55,
          left: '50%', marginLeft: (i - 2) * 14,
          animation: 'lootFloat 1.2s ease-out forwards',
          animationDelay: `${i * 0.08}s`,
          zIndex: 10, pointerEvents: 'none',
        }}>{item}</div>
      ))}
      {/* Lid */}
      <svg width={size} height={size * 0.5} viewBox="0 0 16 8"
        style={{ imageRendering: 'pixelated', position: 'absolute', top: 0, zIndex: 2,
          transformOrigin: '50% 100%',
          transform: open ? 'perspective(80px) rotateX(-80deg)' : 'rotateX(0deg)',
          transition: 'transform 0.5s cubic-bezier(0.2,0,0.2,1)',
        }}>
        <rect x="0" y="0" width="16" height="7" fill="#8B5E3C" />
        <rect x="1" y="1" width="14" height="5" fill="#A0702A" />
        <rect x="0" y="6" width="16" height="1" fill="#5C3D1E" />
        <rect x="0" y="0" width="1" height="7" fill="#5C3D1E" />
        <rect x="15" y="0" width="1" height="7" fill="#5C3D1E" />
        <rect x="6" y="2" width="4" height="2" fill="#C8A020" opacity="0.5" />
      </svg>
      {/* Base */}
      <svg width={size} height={size * 0.6} viewBox="0 0 16 10"
        style={{ imageRendering: 'pixelated', position: 'absolute', bottom: 0 }}>
        <rect x="0" y="0" width="16" height="10" fill="#8B5E3C" />
        <rect x="1" y="1" width="14" height="8" fill="#A0702A" />
        <rect x="0" y="0" width="1" height="10" fill="#5C3D1E" />
        <rect x="15" y="0" width="1" height="10" fill="#5C3D1E" />
        <rect x="0" y="9" width="16" height="1" fill="#5C3D1E" />
        <rect x="6" y="3" width="4" height="4" fill="#C8A020" />
        <rect x="7" y="4" width="2" height="2" fill="#8B6010" />
      </svg>
    </div>
  );
}

// Oak Tree
function OakTree({ size = 80, style = {} }) {
  return (
    <svg width={size * 0.8} height={size} viewBox="0 0 12 18" style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="3" y="0" width="6" height="2" fill="#2d8a2d" />
      <rect x="1" y="1" width="10" height="3" fill="#3aaa3a" />
      <rect x="0" y="3" width="12" height="4" fill="#2d8a2d" />
      <rect x="1" y="6" width="10" height="3" fill="#3aaa3a" />
      <rect x="2" y="8" width="8" height="3" fill="#2d8a2d" />
      {/* Leaf highlights */}
      <rect x="3" y="2" width="2" height="1" fill="#50c850" />
      <rect x="7" y="4" width="2" height="1" fill="#50c850" />
      <rect x="2" y="6" width="2" height="1" fill="#50c850" />
      <rect x="8" y="7" width="2" height="1" fill="#50c850" />
      {/* Trunk */}
      <rect x="4" y="10" width="4" height="8" fill="#8B5E3C" />
      <rect x="5" y="11" width="1" height="6" fill="#a07040" />
      <rect x="4" y="11" width="1" height="3" fill="#6b4426" />
    </svg>
  );
}

// Pine Tree
function PineTree({ size = 72, style = {} }) {
  return (
    <svg width={size * 0.55} height={size} viewBox="0 0 9 18" style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="4" y="0" width="1" height="2" fill="#1a6e1a" />
      <rect x="3" y="1" width="3" height="3" fill="#228b22" />
      <rect x="2" y="3" width="5" height="3" fill="#1a6e1a" />
      <rect x="1" y="5" width="7" height="3" fill="#228b22" />
      <rect x="0" y="7" width="9" height="4" fill="#1a6e1a" />
      <rect x="1" y="10" width="7" height="2" fill="#2da82d" />
      <rect x="4" y="11" width="1" height="7" fill="#8B5E3C" />
    </svg>
  );
}

// Cow
function Cow({ size = 56, style = {} }) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const id = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 120); }, 3200);
    return () => clearInterval(id);
  }, []);
  return (
    <svg width={size * 1.6} height={size} viewBox="0 0 26 16" style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="4" y="4" width="14" height="8" fill="#f0e0c8" />
      <rect x="6" y="5" width="4" height="3" fill="#3d2b1f" />
      <rect x="13" y="7" width="3" height="2" fill="#3d2b1f" />
      <rect x="17" y="2" width="8" height="9" fill="#f0e0c8" />
      <rect x="18" y="4" width="2" height="2" fill={blink ? '#f0e0c8' : '#3d2b1f'} />
      <rect x="22" y="5" width="2" height="1" fill="#cc4444" />
      <rect x="22" y="4" width="1" height="2" fill="#aa2222" />
      <rect x="24" y="4" width="1" height="2" fill="#aa2222" />
      {/* Horns */}
      <rect x="18" y="1" width="1" height="2" fill="#d4c0a0" />
      <rect x="22" y="1" width="1" height="2" fill="#d4c0a0" />
      {/* Legs */}
      <rect x="5" y="11" width="2" height="5" fill="#f0e0c8" />
      <rect x="9" y="11" width="2" height="5" fill="#f0e0c8" />
      <rect x="13" y="11" width="2" height="5" fill="#f0e0c8" />
      <rect x="18" y="11" width="2" height="5" fill="#f0e0c8" />
      <rect x="5" y="15" width="2" height="1" fill="#3d2b1f" />
      <rect x="9" y="15" width="2" height="1" fill="#3d2b1f" />
      <rect x="13" y="15" width="2" height="1" fill="#3d2b1f" />
      <rect x="18" y="15" width="2" height="1" fill="#3d2b1f" />
      {/* Udder */}
      <rect x="8" y="11" width="5" height="2" fill="#ffb6c1" />
      {/* Tail */}
      <rect x="2" y="5" width="3" height="5" fill="#f0e0c8" />
      <rect x="1" y="9" width="2" height="2" fill="#3d2b1f" />
    </svg>
  );
}

// Pig
function Pig({ size = 48, style = {} }) {
  return (
    <svg width={size * 1.4} height={size} viewBox="0 0 22 14" style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="2" y="3" width="12" height="8" fill="#f4a0a0" />
      <rect x="4" y="4" width="3" height="2" fill="#cc7070" />
      <rect x="13" y="2" width="7" height="8" fill="#f4a0a0" />
      <rect x="14" y="3" width="2" height="2" fill="#1a0a0a" />
      <rect x="17" y="3" width="2" height="2" fill="#1a0a0a" />
      <rect x="14" y="5" width="4" height="3" fill="#f4a0a0" />
      <rect x="15" y="6" width="1" height="2" fill="#cc5050" />
      <rect x="17" y="6" width="1" height="2" fill="#cc5050" />
      <rect x="14" y="0" width="2" height="3" fill="#f4a0a0" />
      <rect x="17" y="0" width="2" height="3" fill="#f4a0a0" />
      <rect x="14" y="1" width="2" height="1" fill="#cc8080" />
      <rect x="17" y="1" width="2" height="1" fill="#cc8080" />
      <rect x="3" y="10" width="2" height="4" fill="#f4a0a0" />
      <rect x="7" y="10" width="2" height="4" fill="#f4a0a0" />
      <rect x="11" y="10" width="2" height="4" fill="#f4a0a0" />
      <rect x="1" y="5" width="2" height="4" fill="#f4a0a0" />
      <rect x="0" y="4" width="2" height="2" fill="#e07070" />
    </svg>
  );
}

// Sheep
function Sheep({ size = 48, style = {} }) {
  return (
    <svg width={size * 1.5} height={size} viewBox="0 0 24 14" style={{ imageRendering: 'pixelated', ...style }}>
      <rect x="2" y="2" width="14" height="9" fill="#e8e8e8" />
      <rect x="0" y="4" width="4" height="5" fill="#e8e8e8" />
      <rect x="14" y="4" width="4" height="5" fill="#e8e8e8" />
      <rect x="2" y="1" width="4" height="4" fill="#e8e8e8" />
      <rect x="12" y="1" width="4" height="4" fill="#e8e8e8" />
      <rect x="16" y="2" width="7" height="8" fill="#2a2a2a" />
      <rect x="17" y="3" width="2" height="2" fill="#fff" />
      <rect x="20" y="3" width="2" height="2" fill="#fff" />
      <rect x="17" y="3" width="1" height="1" fill="#1a1a1a" />
      <rect x="20" y="3" width="1" height="1" fill="#1a1a1a" />
      <rect x="17" y="6" width="5" height="1" fill="#4a4a4a" />
      <rect x="16" y="0" width="2" height="3" fill="#2a2a2a" />
      <rect x="21" y="0" width="2" height="3" fill="#2a2a2a" />
      <rect x="4" y="10" width="2" height="4" fill="#2a2a2a" />
      <rect x="8" y="10" width="2" height="4" fill="#2a2a2a" />
      <rect x="11" y="10" width="2" height="4" fill="#2a2a2a" />
      <rect x="15" y="10" width="2" height="4" fill="#2a2a2a" />
    </svg>
  );
}

// Chicken
function Chicken({ size = 36, style = {} }) {
  const [bob, setBob] = useState(false);
  useEffect(() => { const id = setInterval(() => { setBob(true); setTimeout(() => setBob(false), 300); }, 1800); return () => clearInterval(id); }, []);
  return (
    <svg width={size} height={size} viewBox="0 0 12 14" style={{ imageRendering: 'pixelated', transform: bob ? 'translateY(-2px)' : '', transition: 'transform 0.15s', ...style }}>
      <rect x="3" y="0" width="6" height="6" fill="#f0f0f0" />
      <rect x="4" y="1" width="2" height="2" fill="#1a1a1a" />
      <rect x="4" y="1" width="1" height="1" fill="#fff" />
      <rect x="5" y="3" width="3" height="1" fill="#ff8800" />
      <rect x="4" y="0" width="3" height="1" fill="#dd0000" />
      <rect x="2" y="5" width="8" height="5" fill="#f0f0f0" />
      <rect x="1" y="5" width="3" height="4" fill="#e8e8e8" />
      <rect x="1" y="6" width="2" height="1" fill="#d0d0d0" />
      <rect x="4" y="10" width="2" height="4" fill="#ffaa44" />
      <rect x="7" y="10" width="2" height="4" fill="#ffaa44" />
      <rect x="0" y="7" width="2" height="2" fill="#f0f0f0" />
    </svg>
  );
}

// Enderman
function Enderman({ size = 80, style = {} }) {
  const [tele, setTele] = useState(false);
  useEffect(() => { const id = setInterval(() => { setTele(true); setTimeout(() => setTele(false), 300); }, 4000); return () => clearInterval(id); }, []);
  return (
    <svg width={size * 0.45} height={size} viewBox="0 0 7 24" style={{ imageRendering: 'pixelated', opacity: tele ? 0.15 : 1, transition: 'opacity 0.1s', ...style }}>
      <rect x="1" y="0" width="5" height="5" fill="#1a1a1a" />
      <rect x="1" y="2" width="1" height="1" fill="#9333ea" />
      <rect x="4" y="2" width="1" height="1" fill="#9333ea" />
      <rect x="2" y="5" width="3" height="7" fill="#1a1a1a" />
      <rect x="0" y="5" width="2" height="9" fill="#1a1a1a" />
      <rect x="5" y="5" width="2" height="9" fill="#1a1a1a" />
      <rect x="2" y="12" width="1" height="12" fill="#1a1a1a" />
      <rect x="4" y="12" width="1" height="12" fill="#1a1a1a" />
    </svg>
  );
}

// Skeleton
function Skeleton({ size = 64, style = {} }) {
  const [rattle, setRattle] = useState(false);
  useEffect(() => { const id = setInterval(() => { setRattle(true); setTimeout(() => setRattle(false), 100); }, 2500); return () => clearInterval(id); }, []);
  return (
    <svg width={size * 0.55} height={size} viewBox="0 0 9 20" style={{ imageRendering: 'pixelated', transform: rattle ? 'rotate(2deg)' : '', transition: 'transform 0.05s', ...style }}>
      <rect x="1" y="0" width="7" height="6" fill="#e8e8e8" />
      <rect x="2" y="2" width="2" height="2" fill="#2a2a2a" />
      <rect x="5" y="2" width="2" height="2" fill="#2a2a2a" />
      <rect x="2" y="4" width="5" height="1" fill="#2a2a2a" />
      <rect x="2" y="6" width="5" height="5" fill="#e8e8e8" />
      <rect x="3" y="7" width="3" height="3" fill="#c8c8c8" />
      <rect x="0" y="6" width="2" height="6" fill="#e8e8e8" />
      <rect x="7" y="6" width="2" height="6" fill="#e8e8e8" />
      <rect x="3" y="11" width="1" height="9" fill="#e8e8e8" />
      <rect x="5" y="11" width="1" height="9" fill="#e8e8e8" />
      <rect x="2" y="18" width="3" height="2" fill="#e8e8e8" />
      <rect x="4" y="18" width="3" height="2" fill="#e8e8e8" />
    </svg>
  );
}

// Diamond Ore Block
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

// TNT Block
function TNTBlock({ size = 44, style = {} }) {
  const [flash, setFlash] = useState(false);
  useEffect(() => { const id = setInterval(() => { setFlash(true); setTimeout(() => setFlash(false), 180); }, 2200); return () => clearInterval(id); }, []);
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

// Torch
function Torch({ style = {} }) {
  const [f, setF] = useState(0);
  useEffect(() => { const id = setInterval(() => setF(x => (x + 1) % 3), 110); return () => clearInterval(id); }, []);
  const fc = ['#ff8c00', '#ff5500', '#ffaa00'][f];
  return (
    <div style={{ position: 'relative', width: 14, height: 38, ...style }}>
      <div style={{ position: 'absolute', top: 0, left: 3, width: 8, height: 8, background: fc, boxShadow: `0 0 ${8 + f * 4}px ${fc}, 0 0 20px ${fc}66`, transition: 'all 0.09s' }} />
      <div style={{ position: 'absolute', top: 7, left: 5, width: 4, height: 20, background: '#8B5E3C', boxShadow: 'inset 2px 0 rgba(0,0,0,0.3)' }} />
    </div>
  );
}

// Night stars
function NightSky() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <svg style={{ position: 'absolute', top: 20, right: 80, width: 52, height: 52 }} viewBox="0 0 14 14">
        <rect x="3" y="0" width="8" height="2" fill="#fffde0" />
        <rect x="1" y="2" width="12" height="8" fill="#fffde0" />
        <rect x="0" y="3" width="14" height="6" fill="#fffde0" />
        <rect x="3" y="12" width="8" height="2" fill="#fffde0" />
        <rect x="3" y="4" width="2" height="2" fill="#e8e060" />
        <rect x="7" y="7" width="3" height="2" fill="#e8e060" />
        <rect x="4" y="4" width="1" height="1" fill="#fffaaa" />
      </svg>
      {Array.from({ length: 35 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
          height: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
          background: '#fff',
          top: `${3 + (i * 6.7) % 50}%`,
          left: `${(i * 11.3) % 96}%`,
          animation: `starTwinkle ${1.2 + (i % 5) * 0.35}s ${(i * 0.27) % 2.5}s ease-in-out infinite`,
          imageRendering: 'pixelated',
          boxShadow: i % 5 === 0 ? '0 0 4px #fff' : 'none',
        }} />
      ))}
    </div>
  );
}

// Ground strip
function GroundStrip({ colors, h }) {
  const count = 60;
  return (
    <div style={{ display: 'flex', height: h, overflow: 'hidden', flexShrink: 0, width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          flex: '1 0 0',
          background: colors[i % colors.length],
          boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.25), inset 3px 3px 0 rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(0,0,0,0.15)',
        }} />
      ))}
    </div>
  );
}

// Typewriter
function Typewriter({ text, speed = 35 }) {
  const [shown, setShown] = useState('');
  useEffect(() => {
    let i = 0; setShown('');
    const id = setInterval(() => { setShown(text.slice(0, ++i)); if (i >= text.length) clearInterval(id); }, speed);
    return () => clearInterval(id);
  }, [text]);
  return <span>{shown}<span style={{ animation: 'mcBlink 0.8s step-end infinite', color: '#4ade80' }}>█</span></span>;
}

// Autocrawling Steve
function AutoSteve() {
  const [x, setX] = useState(-80);
  const xRef = useRef(-80);
  useEffect(() => {
    let raf;
    const step = () => {
      xRef.current += 0.7;
      if (xRef.current > window.innerWidth + 80) xRef.current = -80;
      setX(xRef.current);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div style={{ position: 'absolute', bottom: 76, left: x, zIndex: 5, pointerEvents: 'none' }}>
      <Steve size={40} />
    </div>
  );
}

const FEATURES = [
  { icon: '🕸', title: 'Call Graph Viz', desc: 'See exactly how every function calls another. Interactive node graph with zoom, filter, and focus.', color: '#4ade80' },
  { icon: '🤖', title: 'AI Q&A', desc: 'Ask anything about the repo in plain English. Get instant, cited answers from your codebase.', color: '#a78bfa' },
  { icon: '🗂', title: 'File Structure', desc: 'Navigate any repo structure with an intelligent tree view. See dependencies at a glance.', color: '#fbbf24' },
  { icon: '📊', title: 'Code Analytics', desc: 'Complexity scores, hotspot detection, language breakdown, and contributor impact analysis.', color: '#f87171' },
  { icon: '🔍', title: 'Function Drill', desc: 'Deep dive into any function — callers, callees, docstrings, history, and AI explanation.', color: '#34d399' },
  { icon: '🕐', title: 'Analysis History', desc: 'Every analysis is saved. Revisit, compare, and track how your codebase evolves over time.', color: '#60a5fa' },
];

const STEPS = [
  { n: '01', title: 'Paste GitHub URL', desc: 'Drop any public or private GitHub, GitLab, or Bitbucket URL into the analyzer.', emoji: '📋' },
  { n: '02', title: 'AI Crawls the Code', desc: 'Our engine parses every file, maps call graphs, and indexes the entire repository.', emoji: '⚙️' },
  { n: '03', title: 'Understand Instantly', desc: 'Explore the visual graph, ask questions, and get analytics — all in under 60 seconds.', emoji: '✨' },
];

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════ */
export default function Home() {
  useScrollReveal();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');
        *{box-sizing:border-box;}

        /* Cursor */
        body{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect x='2' y='2' width='8' height='8' fill='%234ade80'/%3E%3Crect x='10' y='10' width='8' height='8' fill='%234ade80'/%3E%3C/svg%3E") 4 4,crosshair;}

        /* Scroll reveal */
        [data-reveal]{opacity:0;transform:translateY(36px);transition:opacity 0.75s ease,transform 0.75s ease;}
        [data-reveal].revealed{opacity:1;transform:translateY(0);}
        [data-reveal][data-d='1']{transition-delay:.08s;}
        [data-reveal][data-d='2']{transition-delay:.18s;}
        [data-reveal][data-d='3']{transition-delay:.28s;}
        [data-reveal][data-d='4']{transition-delay:.38s;}
        [data-reveal][data-d='5']{transition-delay:.48s;}
        [data-reveal][data-d='6']{transition-delay:.58s;}

        @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes mcFloat{0%,100%{transform:translateY(0)rotate(0deg);}40%{transform:translateY(-14px)rotate(4deg);}70%{transform:translateY(-6px)rotate(-2deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        @keyframes starTwinkle{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.15;transform:scale(0.3);}}
        @keyframes neonPulse{0%,100%{text-shadow:4px 4px 0 #040d07,0 0 20px rgba(74,222,128,0.4);}50%{text-shadow:4px 4px 0 #040d07,0 0 50px rgba(74,222,128,0.9),0 0 90px rgba(74,222,128,0.3);}}
        @keyframes glitch{0%,88%,100%{clip-path:none;transform:none;color:#4ade80;}90%{clip-path:inset(25% 0 55% 0);transform:translate(-5px);color:#ff4444;}92%{clip-path:inset(55% 0 15% 0);transform:translate(5px);color:#4444ff;}94%{clip-path:inset(0 0 85% 0);transform:translate(-2px);color:#4ade80;}}
        @keyframes lootFloat{0%{opacity:1;transform:translateY(0) scale(1);}100%{opacity:0;transform:translateY(-50px) scale(0.4);}}
        @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-7px) scale(1.25);}}
        @keyframes xpPop{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}
        @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
        @keyframes creeperPulse{0%,100%{filter:drop-shadow(0 0 6px #4ade80);}50%{filter:drop-shadow(0 0 20px #4ade80) drop-shadow(0 0 40px #22c55e);}}
        @keyframes endermanGlow{0%,100%{filter:drop-shadow(0 0 4px #9333ea);}50%{filter:drop-shadow(0 0 18px #a855f7) drop-shadow(0 0 36px #7c3aed);}}
        @keyframes digUnderline{from{width:0;}to{width:100%;}}
        @keyframes torchFlicker{0%,100%{opacity:1;}50%{opacity:0.7;}}
        @keyframes spinStar{from{transform:rotate(0deg);}to{transform:rotate(360deg);}}
        @keyframes popIn{from{transform:scale(0) rotate(-15deg);opacity:0;}70%{transform:scale(1.1) rotate(2deg);}to{transform:scale(1) rotate(0);opacity:1;}}
        @keyframes rainbowShadow{
          0%{box-shadow:6px 6px 0 #052e16, 0 0 20px #4ade8066;}
          33%{box-shadow:6px 6px 0 #052e16, 0 0 20px #60a5fa66;}
          66%{box-shadow:6px 6px 0 #052e16, 0 0 20px #a78bfa66;}
          100%{box-shadow:6px 6px 0 #052e16, 0 0 20px #4ade8066;}
        }
        @keyframes groundWiggle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1px);}}

        .pg{
          position:absolute;inset:0;
          background-image:linear-gradient(rgba(74,222,128,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.03) 1px,transparent 1px);
          background-size:40px 40px;pointer-events:none;
        }
        .scanline{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
        .scanline::after{content:'';position:absolute;left:0;right:0;height:3px;background:rgba(74,222,128,0.06);animation:scanMove 10s linear infinite;top:0;}

        .mc-btn{
          display:inline-flex;align-items:center;gap:8px;
          font-family:'Press Start 2P',monospace;font-size:9px;letter-spacing:1px;
          padding:14px 28px;color:#fff;text-decoration:none;cursor:pointer;border:none;
          position:relative;overflow:hidden;transition:transform 0.1s,box-shadow 0.1s;
          image-rendering:pixelated;
        }
        .mc-btn::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 50%);pointer-events:none;}
        .mc-btn:hover{transform:translate(-3px,-3px);}
        .mc-btn:active{transform:translate(2px,2px);}
        .btn-g{background:linear-gradient(180deg,#16a34a,#15803d);box-shadow:5px 5px 0 #052e16;}
        .btn-g:hover{box-shadow:8px 8px 0 #052e16;}
        .btn-o{background:transparent;border:3px solid #22c55e;color:#4ade80;box-shadow:5px 5px 0 #052e16;}
        .btn-o:hover{box-shadow:8px 8px 0 #052e16;background:rgba(74,222,128,0.08);}

        .inv-slot{
          background:#0a1a0d;
          border:3px solid #22c55e;
          box-shadow:inset -4px -4px 0 rgba(0,0,0,0.5),inset 3px 3px 0 rgba(255,255,255,0.07);
        }
        .fcard{
          background:#0b1e10;border:3px solid #1a4528;padding:26px;
          position:relative;overflow:hidden;transition:all 0.18s;cursor:default;
        }
        .fcard::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(74,222,128,0.04) 0%,transparent 60%);pointer-events:none;}
        .fcard:hover{transform:translate(-4px,-4px);}
      `}</style>

      <ScrollProgress />

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
  background: 'linear-gradient(180deg,#000a04 0%,#020f07 35%,#051a0c 70%,#071f10 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  textAlign: 'center',
  paddingTop: '30px'
}}>
        <div className="pg" />
        <div className="scanline" />
        <NightSky />

        {/* Floating pixel blocks */}
        {[
          { t:'9%',  l:'3%',   s:44, c:'#4ade80', d:'0s'   },
          { t:'22%', r:'5%',   s:30, c:'#92400e', d:'1.1s' },
          { t:'48%', l:'6%',   s:26, c:'#1d4ed8', d:'2.0s' },
          { t:'68%', r:'4%',   s:38, c:'#dc2626', d:'0.6s' },
          { t:'32%', l:'1%',   s:20, c:'#86efac', d:'1.7s' },
          { t:'80%', l:'52%',  s:24, c:'#6b4226', d:'2.4s' },
          { t:'14%', l:'73%',  s:22, c:'#4ade80', d:'2.9s' },
          { t:'44%', r:'11%',  s:34, c:'#7c3aed', d:'1.4s' },
          { t:'62%', l:'82%',  s:18, c:'#fbbf24', d:'0.3s' },
          { t:'18%', l:'45%',  s:16, c:'#f472b6', d:'3.2s' },
        ].map((b, i) => (
          <div key={i} style={{
            position:'absolute', top:b.t, left:b.l, right:b.r,
            width:b.s, height:b.s, background:b.c,
            boxShadow:`inset -${b.s*0.14}px -${b.s*0.14}px 0 rgba(0,0,0,0.5),inset ${b.s*0.09}px ${b.s*0.09}px 0 rgba(255,255,255,0.12)`,
            animation:`mcFloat ${3.2+i*0.35}s ${b.d} ease-in-out infinite`,
            imageRendering:'pixelated', zIndex:1, opacity:0.65,
          }} />
        ))}

        {/* Corner torches */}
        <Torch style={{ position:'absolute', top:84, left:48, zIndex:6 }} />
        <Torch style={{ position:'absolute', top:84, right:48, zIndex:6 }} />

        {/* Left forest + chest */}
        <div style={{ position:'absolute', bottom:80, left:0, display:'flex', alignItems:'flex-end', gap:4, zIndex:4 }}>
          <PineTree size={70} />
          <OakTree size={95} />
          <OakTree size={75} />
          <Chest size={50} style={{ marginBottom:4 }} />
          <DiamondOre size={36} style={{ marginBottom:4 }} />
        </div>
        {/* Right forest + skeleton */}
        <div style={{ position:'absolute', bottom:80, right:0, display:'flex', alignItems:'flex-end', gap:4, zIndex:4, flexDirection:'row-reverse' }}>
          <PineTree size={65} />
          <OakTree size={88} />
          <div style={{ animation:'endermanGlow 2.2s ease-in-out infinite' }}><Enderman size={78} /></div>
          <Skeleton size={58} style={{ marginBottom:4 }} />
          <TNTBlock size={36} style={{ marginBottom:4 }} />
        </div>

        {/* Floating animals */}
        <div style={{ position:'absolute', bottom:86, left:'18%', animation:'mcFloat 2.8s 0.4s ease-in-out infinite', zIndex:4 }}>
          <Chicken size={32} />
        </div>
        <div style={{ position:'absolute', bottom:86, right:'20%', animation:'mcFloat 3s 1.1s ease-in-out infinite', zIndex:4 }}>
          <Sheep size={40} />
        </div>

        {/* Hero content */}
        <div style={{ position:'relative', zIndex:10, maxWidth:880, animation:'fadeUp 0.9s ease both' }}>

          {/* Creeper mascot */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:16, animation:'creeperPulse 2.5s ease-in-out infinite' }}>
            <CreepFace size={72} />
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily:"'Press Start 2P',monospace",
            fontSize:'clamp(15px,3vw,34px)',
            lineHeight:1.75,
            animation:'neonPulse 3s ease-in-out infinite, glitch 10s 4s ease-in-out infinite',
            letterSpacing:2, marginBottom:6,
          }}>
            UNDERSTAND ANY
          </h1>
          <h1 style={{
            fontFamily:"'Press Start 2P',monospace",
            fontSize:'clamp(15px,3vw,34px)',
            color:'#86efac',
            textShadow:'4px 4px 0 #040d07',
            lineHeight:1.75, letterSpacing:2, marginBottom:28,
          }}>
            CODEBASE INSTANTLY
          </h1>

          {/* Animated dig bar */}
          <div style={{ display:'flex', justifyContent:'center', gap:3, marginBottom:32 }}>
            {Array.from({length:22}).map((_,i)=>(
              <div key={i} style={{
                width:14, height:5,
                background: i < 14 ? '#22c55e' : '#0d2a14',
                boxShadow: i < 14 ? '0 0 6px #22c55e' : 'none',
                animation:`xpPop ${0.4+i*0.04}s ease-in-out infinite`,
                animationDelay:`${i*0.07}s`,
              }} />
            ))}
          </div>

          {/* Typewriter */}
          <p style={{
            fontFamily:"'VT323',monospace", fontSize:22,
            color:'#86efac', lineHeight:1.8,
            maxWidth:680, margin:'0 auto 40px',
          }}>
            <Typewriter text="Paste a GitHub URL → Get call graphs, AI Q&A, file trees, and code analytics. All in under 60 seconds." speed={28} />
          </p>

          {/* CTAs */}
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom:40 }}>
            <Link to="/signup" className="mc-btn btn-g" style={{ fontSize:10, padding:'16px 32px' }}>
              ▶ ANALYZE FREE REPO
            </Link>
            <Link to="/features" className="mc-btn btn-o" style={{ fontSize:10, padding:'16px 32px' }}>
              SEE FEATURES
            </Link>
          </div>

          {/* URL box */}
          <div style={{
            display:'flex', maxWidth:640, margin:'0 auto',
            border:'3px solid #22c55e',
            boxShadow:'6px 6px 0 #040d07, 0 0 40px rgba(74,222,128,0.15)',
            animation:'rainbowShadow 6s ease-in-out infinite',
          }}>
            <div style={{ flex:1, padding:'14px 18px', background:'#020c06', fontFamily:"'VT323',monospace", fontSize:22, color:'#1e5a2e' }}>
              github.com/your/repository<span style={{ animation:'mcBlink 0.9s step-end infinite', color:'#4ade80' }}>█</span>
            </div>
            <Link to="/analyze" style={{
              padding:'14px 22px', background:'#15803d', color:'#4ade80',
              fontFamily:"'Press Start 2P',monospace", fontSize:8, textDecoration:'none',
              whiteSpace:'nowrap', borderLeft:'3px solid #22c55e',
              display:'flex', alignItems:'center',
              transition:'background 0.15s',
            }}
              onMouseOver={e=>e.currentTarget.style.background='#16a34a'}
              onMouseOut={e=>e.currentTarget.style.background='#15803d'}
            >
              ANALYZE →
            </Link>
          </div>

          {/* XP orb trail */}
          <div style={{ display:'flex', justifyContent:'center', gap:5, marginTop:30 }}>
            {Array.from({length:14}).map((_,i)=>(
              <div key={i} style={{
                width:10, height:10, borderRadius:'50%',
                background:'#a3e635', boxShadow:'0 0 6px #a3e635',
                animation:`xpBounce 1.4s ${i*0.1}s ease-in-out infinite`,
                opacity: 1 - i*0.06,
              }} />
            ))}
          </div>
        </div>

        {/* Autocrawling Steve */}
        <AutoSteve />

        {/* Ground blocks */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:4 }}>
          <GroundStrip colors={['#4a8c3f','#3a7230','#2d5a26','#4a8c3f']} h={30} />
          <GroundStrip colors={['#6b4226','#8B5E3C','#5c3d1e','#6b4226']} h={22} />
          <GroundStrip colors={['#3d2b14','#4a3620','#3d2b14','#5a4228']} h={18} />
        </div>

        {/* Scroll cue */}
        <div style={{ position:'absolute', bottom:88, left:'50%', transform:'translateX(-50%)', fontFamily:"'Press Start 2P',monospace", fontSize:7, color:'#1a4a2e', zIndex:5, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
          SCROLL
          <div style={{ width:18, height:28, border:'3px solid #1a4a2e', display:'flex', justifyContent:'center', paddingTop:4 }}>
            <div style={{ width:4, height:8, background:'#22c55e', animation:'mcFloat 1.4s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* Ground divider */}
      <div>
        <GroundStrip colors={['#4a8c3f','#2d5a26','#4a8c3f','#3a7230']} h={14} />
        <GroundStrip colors={['#8B5E3C','#6b4226','#8B5E3C','#5c3d1e']} h={10} />
      </div>

      {/* ══════════════ STATS ══════════════ */}


      <>
  <style>{`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 22px;
    }
    .stats-corner-deco { display: block; }

    @media (max-width: 900px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
    }
    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
      }
      .stats-section {
        padding: 40px 14px !important;
      }
      .stats-corner-deco {
        display: none;
      }
    }
  `}</style>

  <section className="stats-section" style={{
    background: '#071a0c',
    borderTop: '4px solid #22c55e',
    borderBottom: '4px solid #22c55e',
    padding: '70px 60px',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div className="pg" />

    <div className="stats-corner-deco" style={{ position: 'absolute', top: 12, left: 12 }}><DiamondOre size={34} /></div>
    <div className="stats-corner-deco" style={{ position: 'absolute', top: 12, right: 12 }}><DiamondOre size={34} /></div>
    <div className="stats-corner-deco" style={{ position: 'absolute', bottom: 12, left: 12 }}><TNTBlock size={30} /></div>
    <div className="stats-corner-deco" style={{ position: 'absolute', bottom: 12, right: 12 }}><TNTBlock size={30} /></div>
    <Torch className="stats-corner-deco" style={{ position: 'absolute', top: 12, left: 60 }} />
    <Torch className="stats-corner-deco" style={{ position: 'absolute', top: 12, right: 60 }} />

    <div data-reveal style={{ textAlign: 'center', marginBottom: 52 }}>
      <div style={{ fontFamily: "'VT323',monospace", fontSize: 22, color: '#1a4a2e', letterSpacing: 5 }}>
        ▸ SERVER STATISTICS ◂
      </div>
    </div>

    <div className="stats-grid">
      {[
        { icon: '🗂', label: 'Repos Analyzed', value: '12,400+', sub: 'and counting', c: '#4ade80' },
        { icon: '⚡', label: 'Avg Analysis', value: '< 60s', sub: 'URL to insights', c: '#fbbf24' },
        { icon: '💬', label: 'AI Questions', value: '340K+', sub: 'answered', c: '#60a5fa' },
        { icon: '🌟', label: 'Rating', value: '4.9/5', sub: '2,100+ reviews', c: '#a78bfa' },
      ].map((s, i) => (
        <div key={i} data-reveal data-d={`${i + 1}`}
          style={{
            background: '#0d1f12', border: '3px solid #1a4528',
            padding: '28px 20px', textAlign: 'center',
            boxShadow: '5px 5px 0 #040d07', transition: 'all 0.2s', cursor: 'default',
          }}
          onMouseOver={e => {
            e.currentTarget.style.borderColor = s.c;
            e.currentTarget.style.transform = 'translate(-3px,-3px)';
            e.currentTarget.style.boxShadow = `7px 7px 0 #040d07,0 0 25px ${s.c}44`;
          }}
          onMouseOut={e => {
            e.currentTarget.style.borderColor = '#1a4528';
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '5px 5px 0 #040d07';
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 18, color: s.c, marginBottom: 8, textShadow: `2px 2px 0 #040d07` }}>{s.value}</div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#2d6a3f', letterSpacing: 1, marginBottom: 4 }}>{s.label}</div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#1a3d20' }}>{s.sub}</div>
        </div>
      ))}
    </div>
  </section>
</>

      <div>
        <GroundStrip colors={['#4a8c3f','#3a7230','#4a8c3f']} h={12} />
        <GroundStrip colors={['#6b4226','#8B5E3C','#6b4226']} h={10} />
      </div>

      {/* ══════════════ FEATURES ══════════════ */}
      <section style={{ padding:'clamp(28px,7vw,100px) clamp(16px,6vw,60px)', position:'relative', overflow:'hidden', background:'#050f08' }}>
        <div className="pg" />
        {/* Floating decorations */}
        <div style={{ position:'absolute', top:50, right:30, animation:'mcFloat 4s 0.8s ease-in-out infinite' }}><Skeleton size={62} /></div>
        <div style={{ position:'absolute', bottom:60, left:18, animation:'mcFloat 3.5s ease-in-out infinite' }}><OakTree size={80} /></div>
        <div style={{ position:'absolute', bottom:60, left:82, animation:'mcFloat 4s 1.5s ease-in-out infinite' }}><PineTree size={68} /></div>
        <div style={{ position:'absolute', bottom:74, right:60, animation:'mcFloat 3s 0.6s ease-in-out infinite' }}><Chicken size={34} /></div>
        <div style={{ position:'absolute', bottom:74, right:120, animation:'mcFloat 2.8s 1.2s ease-in-out infinite' }}><Chest size={44} /></div>
        <div style={{ position:'absolute', top:50, left:30, animation:'mcFloat 3.8s 0.4s ease-in-out infinite' }}><DiamondOre size={38} /></div>

        <div data-reveal style={{ textAlign:'center', marginBottom:68 }}>
          <div style={{ fontFamily:"'VT323',monospace", fontSize:22, color:'#1a4a2e', letterSpacing:5, marginBottom:14 }}>✦ INVENTORY UNLOCKED ✦</div>
          <h2 style={{ fontFamily:"'Press Start 2P',monospace", fontSize:'clamp(11px,1.8vw,17px)', color:'#4ade80', textShadow:'3px 3px 0 #040d07, 0 0 28px rgba(74,222,128,0.35)', marginBottom:14 }}>
            EVERY TOOL YOU NEED
          </h2>
          <p style={{ fontFamily:"'VT323',monospace", fontSize:20, color:'#2d6a3f' }}>
            Everything to understand a codebase you've never seen before.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:24 }}>
          {FEATURES.map(({icon,title,desc,color},i)=>(
            <div key={i} data-reveal data-d={`${(i%3)+1}`} className="fcard"
              style={{ '--hc': color }}
              onMouseOver={e=>{ e.currentTarget.style.borderColor=color; e.currentTarget.style.transform='translate(-4px,-4px)'; e.currentTarget.style.boxShadow=`8px 8px 0 #040d07,0 0 28px ${color}33`; }}
              onMouseOut={e=>{ e.currentTarget.style.borderColor='#1a4528'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='none'; }}
            >
              {/* Ore corner */}
              <div style={{ position:'absolute', top:-5, right:-5, width:22, height:22, background:color, boxShadow:`0 0 12px ${color}99` }} />
              {/* Slot + title row */}
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
                <div className="inv-slot" style={{ width:54, height:54, display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, flexShrink:0 }}>
                  {icon}
                </div>
                <div>
                  <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color, lineHeight:1.7, marginBottom:6 }}>{title}</div>
                  {/* Mini star rating */}
                  <div style={{ display:'flex', gap:3 }}>
                    {Array.from({length:5}).map((_,j)=>(
                      <div key={j} style={{ width:9, height:9, background: j<4?color:'#1a3d20', boxShadow: j<4?`0 0 5px ${color}88`:'none' }} />
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ fontFamily:"'VT323',monospace", fontSize:17, color:'#2d6a3f', lineHeight:1.7, marginBottom:18 }}>{desc}</p>
              {/* Durability bar */}
              <div style={{ height:7, background:'#040d07', border:'2px solid #1a4528' }}>
                <div style={{ height:'100%', width:`${58+i*6}%`, background:`linear-gradient(90deg,${color}88,${color})`, boxShadow:`0 0 10px ${color}66` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <GroundStrip colors={['#4a8c3f','#3a7230','#4a8c3f']} h={12} />
        <GroundStrip colors={['#8B5E3C','#6b4226','#8B5E3C']} h={10} />
      </div>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section style={{ padding:'clamp(28px,7vw,100px) clamp(16px,6vw,60px)', background:'#040d07', position:'relative', overflow:'hidden' }}>
        <div className="pg" />
        <div className="scanline" />
        <NightSky />
        {/* Torch walls */}
        <Torch style={{ position:'absolute', left:40, top:'38%', zIndex:4 }} />
        <Torch style={{ position:'absolute', right:40, top:'38%', zIndex:4 }} />
        <Torch style={{ position:'absolute', left:40, top:'68%', zIndex:4 }} />
        <Torch style={{ position:'absolute', right:40, top:'68%', zIndex:4 }} />
        {/* Deco */}
        <div style={{ position:'absolute', top:40, left:'7%', animation:'mcFloat 3.2s ease-in-out infinite' }}><DiamondOre size={34} /></div>
        <div style={{ position:'absolute', top:40, right:'7%', animation:'mcFloat 3.2s 1s ease-in-out infinite' }}><TNTBlock size={30} /></div>
        <div style={{ position:'absolute', bottom:70, right:'5%', animation:'mcFloat 4s 0.5s ease-in-out infinite' }}><Chest size={50} /></div>
        <div style={{ position:'absolute', bottom:70, left:'5%', animation:'mcFloat 3.5s 1.5s ease-in-out infinite' }}><OakTree size={70} /></div>

        <div data-reveal style={{ textAlign:'center', marginBottom:68 }}>
          <div style={{ fontFamily:"'VT323',monospace", fontSize:22, color:'#1a4a2e', letterSpacing:5, marginBottom:14 }}>✦ CRAFTING RECIPE ✦</div>
          <h2 style={{ fontFamily:"'Press Start 2P',monospace", fontSize:'clamp(11px,1.8vw,17px)', color:'#4ade80', textShadow:'3px 3px 0 #040d07' }}>
            HOW IT WORKS
          </h2>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:28, maxWidth:1000, margin:'0 auto', position:'relative' }}>
          {/* Dotted connector */}
          <div style={{ position:'absolute', top:50, left:'15%', right:'15%', height:4, background:'repeating-linear-gradient(90deg,#22c55e 0,#22c55e 14px,transparent 14px,transparent 28px)', zIndex:0 }} />

          {STEPS.map(({n,title,desc,emoji},i)=>{
            const animals = [<Pig size={44}/>, <Cow size={38}/>, <Sheep size={40}/>];
            return (
              <div key={i} data-reveal data-d={`${i+1}`} style={{ textAlign:'center', position:'relative', zIndex:1 }}>
                <div style={{
                  width:100, height:100, margin:'0 auto 22px',
                  background:'#0d1f12', border:'4px solid #22c55e',
                  display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  boxShadow:'8px 8px 0 #040d07, 0 0 20px rgba(74,222,128,0.12)',
                  position:'relative', transition:'all 0.2s',
                }}
                  onMouseOver={e=>{ e.currentTarget.style.transform='translate(-4px,-4px)'; e.currentTarget.style.boxShadow='12px 12px 0 #040d07, 0 0 32px rgba(74,222,128,0.3)'; }}
                  onMouseOut={e=>{ e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='8px 8px 0 #040d07, 0 0 20px rgba(74,222,128,0.12)'; }}
                >
                  <div style={{ fontSize:30, marginBottom:4 }}>{emoji}</div>
                  <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:12, color:'#4ade80', textShadow:'2px 2px 0 #040d07' }}>{n}</div>
                  <div style={{ position:'absolute', top:-7, right:-7, width:14, height:14, background:'#22c55e', boxShadow:'0 0 8px #22c55e' }} />
                  <div style={{ position:'absolute', bottom:-5, left:-5, width:10, height:10, background:'#4ade80' }} />
                </div>
                <h3 style={{ fontFamily:"'Press Start 2P',monospace", fontSize:8, color:'#86efac', marginBottom:12, lineHeight:1.7 }}>{title}</h3>
                <p style={{ fontFamily:"'VT323',monospace", fontSize:17, color:'#2d6a3f', lineHeight:1.7, marginBottom:24 }}>{desc}</p>
                <div style={{ display:'flex', justifyContent:'center', animation:`mcFloat ${2.5+i*0.4}s ${i*0.5}s ease-in-out infinite` }}>
                  {animals[i]}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div>
        <GroundStrip colors={['#4a8c3f','#3a7230','#4a8c3f']} h={12} />
        <GroundStrip colors={['#6b4226','#8B5E3C','#6b4226']} h={10} />
      </div>

      {/* ══════════════ SOCIAL PROOF ══════════════ */}
      <section style={{ padding:'clamp(28px,7vw,80px) clamp(16px,6vw,60px)', background:'#050f08', position:'relative', overflow:'hidden' }}>
        <div className="pg" />
        <div style={{ position:'absolute', top:18, left:18, animation:'mcFloat 3s ease-in-out infinite' }}><PineTree size={58} /></div>
        <div style={{ position:'absolute', top:18, right:18, animation:'mcFloat 3.5s 1s ease-in-out infinite' }}><OakTree size={62} /></div>

        <div data-reveal style={{ textAlign:'center', marginBottom:52 }}>
          <div style={{ fontFamily:"'VT323',monospace", fontSize:22, color:'#1a4a2e', letterSpacing:5 }}>▸ PLAYER REVIEWS ◂</div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:24, maxWidth:1020, margin:'0 auto' }}>
          {[
            { text:'"Saved me 3 days understanding a new repo. This is genuinely insane."', handle:'@devhunter_', c:'#4ade80', badge:'⚔️' },
            { text:'"The call graph is like having X-ray vision for codebases."', handle:'@codesmith_io', c:'#a78bfa', badge:'💎' },
            { text:'"AI Q&A actually knows the context. No hallucinations. Wild."', handle:'@nullpointer__', c:'#fbbf24', badge:'🏆' },
          ].map((t,i)=>(
            <div key={i} data-reveal data-d={`${i+1}`} style={{
              background:'#0d1f12', border:'3px solid #1a4528', padding:'28px',
              boxShadow:'5px 5px 0 #040d07', position:'relative',
              transition:'all 0.18s',
            }}
              onMouseOver={e=>{ e.currentTarget.style.borderColor=t.c; e.currentTarget.style.transform='translate(-3px,-3px)'; e.currentTarget.style.boxShadow=`7px 7px 0 #040d07,0 0 24px ${t.c}33`; }}
              onMouseOut={e=>{ e.currentTarget.style.borderColor='#1a4528'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow='5px 5px 0 #040d07'; }}
            >
              <div style={{ position:'absolute', top:-14, right:18, fontSize:26 }}>{t.badge}</div>
              <p style={{ fontFamily:"'VT323',monospace", fontSize:20, color:'#4ade80', lineHeight:1.7, marginBottom:16 }}>{t.text}</p>
              <div style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, color:t.c, marginBottom:10 }}>{t.handle}</div>
              <div style={{ display:'flex', gap:3 }}>
                {Array.from({length:5}).map((_,j)=>(
                  <span key={j} style={{ color:'#fbbf24', fontSize:16 }}>★</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div>
        <GroundStrip colors={['#4a8c3f','#3a7230','#4a8c3f']} h={12} />
        <GroundStrip colors={['#6b4226','#8B5E3C','#6b4226']} h={10} />
      </div>

      {/* ══════════════ CTA ══════════════ */}
      <section style={{ padding:'clamp(34px,8vw,130px) clamp(16px,6vw,60px)', textAlign:'center', position:'relative', overflow:'hidden', background:'#020a05' }}>
        <div className="pg" />
        <div className="scanline" />
        <NightSky />

        {/* Grand final scene */}
        <div style={{ position:'absolute', bottom:70, left:0, right:0, display:'flex', alignItems:'flex-end', justifyContent:'space-between', padding:'0 16px', zIndex:3, pointerEvents:'none' }}>
          <div style={{ display:'flex', alignItems:'flex-end', gap:6 }}>
            <OakTree size={82} />
            <OakTree size={105} />
            <PineTree size={78} />
            <div style={{ animation:'mcFloat 3s ease-in-out infinite' }}><Cow size={52} /></div>
            <div style={{ animation:'mcFloat 2.6s 0.4s ease-in-out infinite' }}><Chicken size={30} /></div>
            <Chest size={50} style={{ marginBottom:6 }} />
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:6, flexDirection:'row-reverse' }}>
            <PineTree size={82} />
            <OakTree size={92} />
            <div style={{ animation:'mcFloat 3.4s ease-in-out infinite' }}><Sheep size={48} /></div>
            <div style={{ animation:'mcFloat 2.8s 0.8s ease-in-out infinite' }}><Pig size={44} /></div>
            <div style={{ animation:'endermanGlow 2s ease-in-out infinite' }}><Enderman size={72} /></div>
            <Chest size={50} style={{ marginBottom:6 }} />
          </div>
        </div>

        {/* 4 torches */}
        <Torch style={{ position:'absolute', top:38, left:60, zIndex:5 }} />
        <Torch style={{ position:'absolute', top:38, right:60, zIndex:5 }} />
        <Torch style={{ position:'absolute', bottom:110, left:220, zIndex:5 }} />
        <Torch style={{ position:'absolute', bottom:110, right:220, zIndex:5 }} />

        <div data-reveal style={{ position:'relative', zIndex:10 }}>
          <div style={{ fontFamily:"'VT323',monospace", fontSize:22, color:'#1a4a2e', letterSpacing:5, marginBottom:18 }}>✦ FINAL QUEST ✦</div>
          <h2 style={{
            fontFamily:"'Press Start 2P',monospace",
            fontSize:'clamp(14px,2.4vw,24px)',
            color:'#4ade80',
            textShadow:'4px 4px 0 #020a05, 0 0 60px rgba(74,222,128,0.5)',
            marginBottom:24, lineHeight:1.7,
            animation:'neonPulse 2.4s ease-in-out infinite',
          }}>
            READY TO DIG IN?
          </h2>
          <p style={{ fontFamily:"'VT323',monospace", fontSize:22, color:'#2d6a3f', marginBottom:48, maxWidth:520, margin:'0 auto 48px' }}>
            Start analyzing repositories for free. No credit card required.
          </p>
          <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap', marginBottom:48 }}>
            <Link to="/signup" className="mc-btn btn-g" style={{ fontSize:11, padding:'18px 48px' }}>
              ▶ START FOR FREE
            </Link>
            <Link to="/analyze" className="mc-btn btn-o">
              🔍 TRY DEMO
            </Link>
          </div>

          {/* XP progress bar */}
          <div style={{ maxWidth:380, margin:'0 auto 28px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
              <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, color:'#1a4a2e' }}>EXPLORATION PROGRESS</span>
              <span style={{ fontFamily:"'Press Start 2P',monospace", fontSize:7, color:'#22c55e' }}>78%</span>
            </div>
            <div style={{ height:22, border:'4px solid #1a4528', background:'#020a05', position:'relative', boxShadow:'3px 3px 0 #040d07' }}>
              <div style={{ position:'absolute', inset:2, width:'78%', background:'linear-gradient(90deg,#15803d 0%,#22c55e 60%,#86efac 100%)', boxShadow:'0 0 18px rgba(74,222,128,0.65)' }} />
            </div>
            <div style={{ fontFamily:"'VT323',monospace", fontSize:17, color:'#1a4a2e', marginTop:8, textAlign:'right' }}>Sign up to reach 100% ▶</div>
          </div>

          {/* XP orbs */}
          <div style={{ display:'flex', justifyContent:'center', gap:5 }}>
            {Array.from({length:18}).map((_,i)=>(
              <div key={i} style={{ width:11, height:11, borderRadius:'50%', background:'#a3e635', boxShadow:'0 0 8px #a3e635', animation:`xpBounce 1.4s ${i*0.09}s ease-in-out infinite`, opacity:1-i*0.04 }} />
            ))}
          </div>
        </div>

        {/* Bottom ground */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:4 }}>
          <GroundStrip colors={['#4a8c3f','#3a7230','#2d5a26','#4a8c3f']} h={28} />
          <GroundStrip colors={['#6b4226','#8B5E3C','#5c3d1e','#6b4226']} h={20} />
          <GroundStrip colors={['#3d2b14','#4a3620','#3d2b14']} h={16} />
        </div>
      </section>
    </>
  );
}
