import { Link, useParams } from 'react-router-dom';
import { SignUp } from '@clerk/clerk-react';
import { CreeperIcon } from '../../components/ui';
import { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════
   SHARED PIXEL ENTITIES
═══════════════════════════════════════════════════════════ */
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

function GroundStrip({ colors, h }) {
  const count = 60;
  return (
    <div style={{ display: 'flex', height: h, overflow: 'hidden', flexShrink: 0, width: '100%' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          flex: '1 0 0', background: colors[i % colors.length],
          boxShadow: 'inset -3px -3px 0 rgba(0,0,0,0.25), inset 3px 3px 0 rgba(255,255,255,0.07)',
          borderRight: '1px solid rgba(0,0,0,0.15)',
        }} />
      ))}
    </div>
  );
}

function NightSky() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
          height: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
          background: '#fff',
          top: `${3 + (i * 6.7) % 65}%`,
          left: `${(i * 11.3) % 96}%`,
          animation: `starTwinkle ${1.2 + (i % 5) * 0.35}s ${(i * 0.27) % 2.5}s ease-in-out infinite`,
          imageRendering: 'pixelated',
          boxShadow: i % 5 === 0 ? '0 0 4px #fff' : 'none',
        }} />
      ))}
    </div>
  );
}

function CreepFace({ size = 64 }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 16 20" style={{ imageRendering: 'pixelated' }}>
      <rect x="1" y="0" width="14" height="14" fill="#4a8c3f" />
      <rect x="1" y="0" width="3" height="3" fill="#3a7230" />
      <rect x="12" y="0" width="3" height="3" fill="#3a7230" />
      <rect x="4" y="4" width="2" height="2" fill="#5aac4a" />
      <rect x="10" y="2" width="2" height="2" fill="#3a7230" />
      <rect x="3" y="3" width="3" height="3" fill="#1a3d18" />
      <rect x="10" y="3" width="3" height="3" fill="#1a3d18" />
      <rect x="6" y="7" width="4" height="2" fill="#1a3d18" />
      <rect x="4" y="9" width="3" height="3" fill="#1a3d18" />
      <rect x="9" y="9" width="3" height="3" fill="#1a3d18" />
      <rect x="6" y="11" width="4" height="1" fill="#1a3d18" />
      <rect x="4" y="14" width="8" height="6" fill="#4a8c3f" />
      <rect x="4" y="16" width="8" height="1" fill="#3a7230" />
      <rect x="3" y="17" width="4" height="3" fill="#3a7230" />
      <rect x="9" y="17" width="4" height="3" fill="#3a7230" />
    </svg>
  );
}

function XPOrbs({ count = 10 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 22 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: '50%',
          background: '#a3e635', boxShadow: '0 0 6px #a3e635',
          animation: `xpBounce 1.4s ${i * 0.1}s ease-in-out infinite`,
          opacity: 1 - i * 0.08,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLERK STYLES (shared between Signup steps)
═══════════════════════════════════════════════════════════ */
const clerkStyles = `
  .cl-rootBox, .cl-rootBox * { box-sizing: border-box !important; }
  .cl-rootBox  { width: 100% !important; max-width: 100% !important; }
  .cl-card     { background: transparent !important; box-shadow: none !important; border: none !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; }
  .cl-main     { width: 100% !important; }
  .cl-headerTitle, .cl-headerSubtitle, .cl-footer { display: none !important; }
  .cl-socialButtonsBlockButton {
    width: 100% !important; box-sizing: border-box !important;
    background: #020c06 !important; border: 2px solid #22c55e !important;
    color: #4ade80 !important; font-family: 'VT323', monospace !important;
    font-size: 18px !important; border-radius: 0 !important; transition: all 0.1s !important;
  }
  .cl-socialButtonsBlockButton:hover { background: #0d1f12 !important; box-shadow: 3px 3px 0 #052e16 !important; }
  .cl-socialButtonsBlockButtonText { font-family: 'VT323', monospace !important; font-size: 17px !important; }
  .cl-dividerLine { background: #1a4528 !important; }
  .cl-dividerText { color: #4ade80 !important; font-family: 'Press Start 2P', monospace !important; font-size: 7px !important; }
  .cl-formFieldRow, .cl-formField { width: 100% !important; box-sizing: border-box !important; }
  .cl-formFieldLabel {
    color: #2d6a3f !important; font-family: 'Press Start 2P', monospace !important;
    font-size: 7px !important; letter-spacing: 1px !important;
  }
  .cl-formFieldInput {
    width: 100% !important; max-width: 100% !important; box-sizing: border-box !important;
    background: #020c06 !important; border: 2px solid #1a4528 !important;
    border-radius: 0 !important; color: #4ade80 !important;
    font-family: 'VT323', monospace !important; font-size: 20px !important;
    padding: 10px 14px !important; outline: none !important;
  }
  .cl-formFieldInput:focus { border-color: #4ade80 !important; box-shadow: 0 0 0 2px rgba(74,222,128,0.2) !important; }
  .cl-formFieldInputShowPasswordButton { color: #4ade80 !important; }
  .cl-formButtonPrimary {
    width: 100% !important; box-sizing: border-box !important;
    background: linear-gradient(180deg, #16a34a, #15803d) !important;
    border: 3px solid #22c55e !important; border-radius: 0 !important;
    font-family: 'Press Start 2P', monospace !important; font-size: 9px !important;
    padding: 14px !important; box-shadow: 5px 5px 0 #052e16 !important; color: #fff !important;
    letter-spacing: 1px !important; transition: all 0.1s !important;
  }
  .cl-formButtonPrimary:hover { transform: translate(-2px,-2px) !important; box-shadow: 7px 7px 0 #052e16 !important; }
  .cl-formButtonPrimary:active { transform: translate(2px,2px) !important; box-shadow: 2px 2px 0 #052e16 !important; }
  .cl-footerActionLink { color: #4ade80 !important; font-family: 'Press Start 2P', monospace !important; font-size: 7px !important; }
  .cl-footerActionText { color: #1a4a2e !important; font-family: 'Press Start 2P', monospace !important; font-size: 7px !important; }
  .cl-identityPreview {
    width: 100% !important; box-sizing: border-box !important;
    background: #020c06 !important; border: 2px solid #1a4528 !important;
    border-radius: 0 !important; color: #4ade80 !important;
  }
  .cl-identityPreviewText { color: #4ade80 !important; }
  .cl-identityPreviewEditButton { color: #1a4a2e !important; }
  .cl-alternativeMethodsBlockButton {
    width: 100% !important; box-sizing: border-box !important;
    border: 2px solid #1a4528 !important; border-radius: 0 !important;
    color: #4ade80 !important; background: transparent !important;
    font-family: 'VT323', monospace !important; font-size: 16px !important;
  }
  .cl-formResendCodeLink { color: #4ade80 !important; }
  .cl-otpCodeField input {
    background: #020c06 !important; border: 2px solid #1a4528 !important;
    border-radius: 0 !important; color: #4ade80 !important;
    font-family: 'Press Start 2P', monospace !important;
  }
  .cl-formFieldErrorText { color: #f87171 !important; font-family: monospace !important; font-size: 12px !important; }
  .cl-alert { background: #450a0a !important; border: 2px solid #f87171 !important; border-radius: 0 !important; color: #f87171 !important; font-family: monospace !important; }
`;

/* ═══════════════════════════════════════════════════════════
   AUTH SHELL — shared layout wrapper
═══════════════════════════════════════════════════════════ */
function AuthShell({ children, title, subtitle, xpPct = 62 }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');
        *{box-sizing:border-box;}
        body{
          cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20'%3E%3Crect x='2' y='2' width='8' height='8' fill='%234ade80'/%3E%3Crect x='10' y='10' width='8' height='8' fill='%234ade80'/%3E%3C/svg%3E") 4 4,crosshair;
          margin:0; padding:0;
        }
        .pg{
          position:absolute;inset:0;
          background-image:linear-gradient(rgba(74,222,128,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.03) 1px,transparent 1px);
          background-size:40px 40px;pointer-events:none;
        }
        .scanline{position:absolute;inset:0;overflow:visible;pointer-events:none;}
        .scanline::after{content:'';position:absolute;left:0;right:0;height:3px;background:rgba(74,222,128,0.06);animation:scanMove 10s linear infinite;top:0;}
        @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
        @keyframes starTwinkle{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.15;transform:scale(0.3);}}
        @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-7px) scale(1.25);}}
        @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes mcFloat{0%,100%{transform:translateY(0);}40%{transform:translateY(-14px);}70%{transform:translateY(-6px);}}
        @keyframes neonPulse{0%,100%{text-shadow:3px 3px 0 #040d07,0 0 20px rgba(74,222,128,0.4);}50%{text-shadow:3px 3px 0 #040d07,0 0 50px rgba(74,222,128,0.9);}}
        @keyframes creeperPulse{0%,100%{filter:drop-shadow(0 0 6px #4ade80);}50%{filter:drop-shadow(0 0 20px #4ade80) drop-shadow(0 0 40px #22c55e);}}
        @keyframes panelReveal{from{opacity:0;transform:translateY(40px) scale(0.96);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes rainbowBorder{
          0%{box-shadow:8px 8px 0 #052e16, 0 0 30px rgba(74,222,128,0.25);}
          33%{box-shadow:8px 8px 0 #052e16, 0 0 30px rgba(96,165,250,0.25);}
          66%{box-shadow:8px 8px 0 #052e16, 0 0 30px rgba(167,139,250,0.25);}
          100%{box-shadow:8px 8px 0 #052e16, 0 0 30px rgba(74,222,128,0.25);}
        }
        @keyframes xpPop{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}

        /* Pixel text field */
        .mc-field-label {
          display:block; font-family:'Press Start 2P',monospace; font-size:7px;
          color:#2d6a3f; letter-spacing:1px; margin-bottom:8px;
        }
        .mc-field-input {
          width:100%; padding:11px 14px;
          background:#020c06; border:2px solid #1a4528;
          color:#4ade80; font-family:'VT323',monospace; font-size:20px;
          outline:none; transition:border-color 0.15s, box-shadow 0.15s;
        }
        .mc-field-input:focus { border-color:#4ade80; box-shadow:0 0 0 2px rgba(74,222,128,0.2); }
        .mc-field-input::placeholder { color:#1a4528; }

        /* Pixel button */
        .mc-btn-primary {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          width:100%; padding:14px 28px;
          background:linear-gradient(180deg,#16a34a,#15803d);
          border:3px solid #22c55e; border-radius:0;
          font-family:'Press Start 2P',monospace; font-size:9px; letter-spacing:1px;
          color:#fff; cursor:pointer; transition:all 0.1s;
          box-shadow:5px 5px 0 #052e16; position:relative; overflow:hidden;
        }
        .mc-btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.12) 0%,transparent 50%);pointer-events:none;}
        .mc-btn-primary:hover { transform:translate(-3px,-3px); box-shadow:8px 8px 0 #052e16; }
        .mc-btn-primary:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #052e16; }

        .mc-btn-secondary {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          width:100%; padding:12px 24px;
          background:transparent; border:3px solid #22c55e; border-radius:0;
          font-family:'Press Start 2P',monospace; font-size:8px; letter-spacing:1px;
          color:#4ade80; cursor:pointer; transition:all 0.1s;
          box-shadow:4px 4px 0 #052e16; text-decoration:none;
        }
        .mc-btn-secondary:hover { transform:translate(-2px,-2px); box-shadow:6px 6px 0 #052e16; background:rgba(74,222,128,0.08); }
        .mc-btn-secondary:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #052e16; }

        .mc-error {
          background:#450a0a; border:2px solid #f87171;
          padding:10px 14px; font-family:monospace; font-size:13px; color:#f87171;
        }
      `}</style>

      {/* Page background */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#000a04 0%,#020f07 35%,#051a0c 70%,#071f10 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        position: 'relative', padding: '32px 16px 100px', overflow: 'hidden',
      }}>
        <div className="pg" />
        <div className="scanline" />
        <NightSky />

        {/* Floating pixel blocks */}
        {[
          { t: '7%',  l: '2%',  s: 34, c: '#4ade80', d: '0s'   },
          { t: '20%', r: '3%',  s: 24, c: '#92400e', d: '1.1s' },
          { t: '52%', l: '3%',  s: 20, c: '#1d4ed8', d: '2.0s' },
          { t: '70%', r: '4%',  s: 28, c: '#dc2626', d: '0.6s' },
          { t: '38%', l: '1%',  s: 16, c: '#86efac', d: '1.7s' },
          { t: '80%', r: '6%',  s: 20, c: '#7c3aed', d: '2.4s' },
          { t: '14%', l: '90%', s: 16, c: '#fbbf24', d: '0.3s' },
          { t: '62%', l: '92%', s: 22, c: '#f472b6', d: '3.2s' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', top: b.t, left: b.l, right: b.r,
            width: b.s, height: b.s, background: b.c,
            boxShadow: `inset -${b.s * 0.14}px -${b.s * 0.14}px 0 rgba(0,0,0,0.5),inset ${b.s * 0.09}px ${b.s * 0.09}px 0 rgba(255,255,255,0.12)`,
            animation: `mcFloat ${3.2 + i * 0.35}s ${b.d} ease-in-out infinite`,
            imageRendering: 'pixelated', zIndex: 1, opacity: 0.58,
          }} />
        ))}

        {/* Torches */}
        <Torch style={{ position: 'absolute', top: 24, left: 40, zIndex: 6 }} />
        <Torch style={{ position: 'absolute', top: 24, right: 40, zIndex: 6 }} />
        <div style={{ position: 'absolute', top: 20, left: 88, zIndex: 4 }}><DiamondOre size={30} /></div>
        <div style={{ position: 'absolute', top: 20, right: 88, zIndex: 4 }}><DiamondOre size={30} /></div>

        {/* Auth card */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 480,
          animation: 'panelReveal 0.7s cubic-bezier(0.2,0,0.2,1) both',
        }}>
          {/* XP progress bar cap */}
          <div style={{ height: 8, background: '#020c06', border: '2px solid #1a4528', borderBottom: 'none' }}>
            <div style={{
              height: '100%', width: `${xpPct}%`,
              background: 'linear-gradient(90deg,#15803d,#22c55e,#86efac)',
              boxShadow: '0 0 12px rgba(74,222,128,0.6)',
            }} />
          </div>

          {/* Panel body */}
          <div style={{
            background: '#0b1e10',
            border: '4px solid #22c55e', borderTop: '2px solid #22c55e',
            animation: 'rainbowBorder 6s ease-in-out infinite',
            padding: 'clamp(20px,4vw,36px) clamp(16px,5vw,40px) 30px',
          }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 26 }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, animation: 'creeperPulse 2.5s ease-in-out infinite' }}>
                <CreepFace size={50} />
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 12,
                border: '2px solid #22c55e', padding: '6px 18px',
                fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#4ade80', letterSpacing: 2,
                background: 'rgba(21,128,61,0.15)', boxShadow: '0 0 18px rgba(74,222,128,0.15), 3px 3px 0 #040d07',
              }}>
                <span style={{ animation: 'xpBounce 1s ease-in-out infinite' }}>✦</span>
                {title}
                <span style={{ animation: 'xpBounce 1s 0.5s ease-in-out infinite' }}>✦</span>
              </div>
              <p style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: '#2d6a3f', marginTop: 4 }}>
                {subtitle}
                <span style={{ animation: 'mcBlink 0.9s step-end infinite', color: '#4ade80', marginLeft: 2 }}>█</span>
              </p>
              {/* XP segment bar */}
              <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 12 }}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} style={{
                    width: 13, height: 5,
                    background: i < 10 ? '#22c55e' : '#0d2a14',
                    boxShadow: i < 10 ? '0 0 5px #22c55e' : 'none',
                    animation: `xpPop ${0.4 + i * 0.04}s ease-in-out infinite`,
                    animationDelay: `${i * 0.07}s`,
                  }} />
                ))}
              </div>
            </div>

            {/* Slot content */}
            {children}

            <XPOrbs count={10} />
          </div>

          <GroundStrip colors={['#4a8c3f', '#3a7230', '#2d5a26', '#4a8c3f']} h={11} />
          <GroundStrip colors={['#6b4226', '#8B5E3C', '#5c3d1e', '#6b4226']} h={9} />
        </div>

        {/* Page-level ground */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4 }}>
          <GroundStrip colors={['#4a8c3f', '#3a7230', '#2d5a26', '#4a8c3f']} h={20} />
          <GroundStrip colors={['#6b4226', '#8B5E3C', '#5c3d1e', '#6b4226']} h={15} />
          <GroundStrip colors={['#3d2b14', '#4a3620', '#3d2b14', '#5a4228']} h={11} />
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   SIGNUP
═══════════════════════════════════════════════════════════ */
export function Signup() {
  return (
    <AuthShell title="JOIN REPOLINK" subtitle="Analyze your first repo in 60 seconds" xpPct={30}>
      <style>{clerkStyles}</style>
      <div style={{ width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
        <SignUp
          routing="hash"
          redirectUrl="/dashboard"
          appearance={{ layout: { socialButtonsVariant: 'blockButton' } }}
        />
      </div>
      <div style={{ marginTop: 20, textAlign: 'center', fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#1a4a2e' }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: '#4ade80', textDecoration: 'none' }}>Log in</Link>
      </div>
    </AuthShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   FORGOT PASSWORD
═══════════════════════════════════════════════════════════ */
export function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <AuthShell title="FORGOT PASSWORD?" subtitle="We'll send you a reset link" xpPct={45}>
      {sent ? (
        /* ── Success state ── */
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          {/* Animated chest icon replacement */}
          <div style={{ fontSize: 52, marginBottom: 16, animation: 'mcFloat 2s ease-in-out infinite' }}>📬</div>

          {/* Success badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18,
            border: '2px solid #22c55e', padding: '8px 20px',
            fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#4ade80',
            background: 'rgba(21,128,61,0.15)', boxShadow: '3px 3px 0 #040d07',
          }}>
            ✔ CHECK YOUR EMAIL
          </div>

          <p style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: '#2d6a3f', lineHeight: 1.7, marginBottom: 26 }}>
            Reset link sent to{' '}
            <span style={{ color: '#4ade80', fontFamily: "'Press Start 2P',monospace", fontSize: 8 }}>{email}</span>
          </p>

          {/* Divider */}
          <div style={{ height: 2, background: '#1a4528', margin: '0 0 24px' }} />

          <Link to="/login" className="mc-btn-secondary" style={{ display: 'inline-flex', width: 'auto', padding: '12px 28px' }}>
            ← BACK TO LOGIN
          </Link>
        </div>
      ) : (
        /* ── Form state ── */
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label className="mc-field-label" htmlFor="fp-email">EMAIL ADDRESS</label>
            <input
              id="fp-email" type="email" required
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mc-field-input"
            />
          </div>

          <button type="submit" className="mc-btn-primary">
            ▶ SEND RESET LINK
          </button>

          {/* Back link */}
          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={{
              fontFamily: "'Press Start 2P',monospace", fontSize: 7,
              color: '#1a4a2e', textDecoration: 'none', transition: 'color 0.15s',
            }}
              onMouseOver={e => e.target.style.color = '#4ade80'}
              onMouseOut={e => e.target.style.color = '#1a4a2e'}
            >
              ← Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   RESET PASSWORD
═══════════════════════════════════════════════════════════ */
export function ResetPassword() {
  const { token } = useParams();
  const [done, setDone] = useState(false);
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pw !== pw2) { setErr('Passwords do not match.'); return; }
    if (pw.length < 8) { setErr('Password must be at least 8 characters.'); return; }
    setErr('');
    setDone(true);
  };

  return (
    <AuthShell title="SET NEW PASSWORD" subtitle="Choose a strong new password" xpPct={78}>
      {done ? (
        /* ── Done state ── */
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ fontSize: 52, marginBottom: 16, animation: 'mcFloat 2s ease-in-out infinite' }}>✅</div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 18,
            border: '2px solid #22c55e', padding: '8px 20px',
            fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#4ade80',
            background: 'rgba(21,128,61,0.15)', boxShadow: '3px 3px 0 #040d07',
          }}>
            ✔ PASSWORD UPDATED!
          </div>

          <p style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: '#2d6a3f', lineHeight: 1.7, marginBottom: 26 }}>
            Your password has been reset successfully. You can now log in.
          </p>

          <div style={{ height: 2, background: '#1a4528', margin: '0 0 24px' }} />
          <Link to="/login" className="mc-btn-primary" style={{ textDecoration: 'none' }}>
            ▶ LOG IN NOW
          </Link>
        </div>
      ) : (
        /* ── Form state ── */
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Token badge */}
          {token && (
            <div style={{
              background: '#020c06', border: '2px solid #1a4528',
              padding: '8px 12px', fontFamily: 'monospace', fontSize: 11, color: '#1a4a2e',
              wordBreak: 'break-all',
            }}>
              🔑 Token: {token.slice(0, 24)}…
            </div>
          )}

          {err && <div className="mc-error">⚠ {err}</div>}

          <div>
            <label className="mc-field-label" htmlFor="pw">NEW PASSWORD</label>
            <input
              id="pw" type="password" required
              value={pw} onChange={e => setPw(e.target.value)}
              placeholder="Min. 8 characters"
              className="mc-field-input"
            />
          </div>

          <div>
            <label className="mc-field-label" htmlFor="pw2">CONFIRM PASSWORD</label>
            <input
              id="pw2" type="password" required
              value={pw2} onChange={e => setPw2(e.target.value)}
              placeholder="Same as above"
              className="mc-field-input"
            />
          </div>

          {/* Password strength meter */}
          {pw.length > 0 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e' }}>PASSWORD STRENGTH</span>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: pw.length >= 12 ? '#4ade80' : pw.length >= 8 ? '#fbbf24' : '#f87171' }}>
                  {pw.length >= 12 ? 'STRONG' : pw.length >= 8 ? 'OK' : 'WEAK'}
                </span>
              </div>
              <div style={{ height: 7, background: '#020c06', border: '2px solid #1a4528' }}>
                <div style={{
                  height: '100%',
                  width: pw.length >= 12 ? '100%' : pw.length >= 8 ? '60%' : '25%',
                  background: pw.length >= 12
                    ? 'linear-gradient(90deg,#15803d,#22c55e)'
                    : pw.length >= 8
                    ? 'linear-gradient(90deg,#92400e,#fbbf24)'
                    : '#dc2626',
                  boxShadow: '0 0 8px currentColor',
                  transition: 'width 0.3s ease, background 0.3s',
                }} />
              </div>
            </div>
          )}

          <button type="submit" className="mc-btn-primary">
            ▶ RESET PASSWORD
          </button>
        </form>
      )}
    </AuthShell>
  );
}
