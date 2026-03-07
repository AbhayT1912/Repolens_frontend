import { Link } from 'react-router-dom';
import { SignIn } from '@clerk/clerk-react';
import { CreeperIcon } from '../../components/ui';
import { useEffect, useState } from 'react';

/* ═══════════════════════════════════════════════════════════
   REUSED PIXEL ENTITIES (self-contained, no shared imports)
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

function NightSky() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
          height: i % 4 === 0 ? 4 : i % 3 === 0 ? 3 : 2,
          background: '#fff',
          top: `${3 + (i * 6.7) % 60}%`,
          left: `${(i * 11.3) % 96}%`,
          animation: `starTwinkle ${1.2 + (i % 5) * 0.35}s ${(i * 0.27) % 2.5}s ease-in-out infinite`,
          imageRendering: 'pixelated',
          boxShadow: i % 5 === 0 ? '0 0 4px #fff' : 'none',
        }} />
      ))}
    </div>
  );
}

/* creeper face SVG for the panel art */
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

/* XP orb row */
function XPOrbs({ count = 12 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 24 }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{
          width: 10, height: 10, borderRadius: '50%',
          background: '#a3e635', boxShadow: '0 0 6px #a3e635',
          animation: `xpBounce 1.4s ${i * 0.1}s ease-in-out infinite`,
          opacity: 1 - i * 0.07,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CLERK STYLES
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
  
  .cl-socialButtonsBlockButton {
    width: 100% !important;
    box-sizing: border-box !important;
    background: #020c06 !important;
    border: 2px solid #22c55e !important;
    color: #4ade80 !important;
    font-family: 'VT323', monospace !important;
    font-size: 18px !important;
    border-radius: 0 !important;
    transition: all 0.1s !important;
    min-height: 48px !important;        /* ← stop vertical clipping */
    height: auto !important;            /* ← override any fixed height */
    padding: 10px 16px !important;      /* ← breathing room */
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: visible !important;       /* ← stop text cutting */
    white-space: nowrap !important;     /* ← keep on one line */
  }

  .cl-socialButtonsBlockButtonText {
    font-family: 'VT323', monospace !important;
    font-size: 17px !important;
    overflow: visible !important;
    white-space: nowrap !important;
    flex-shrink: 0 !important;          /* ← don't shrink and clip */
  }

  .cl-socialButtonsBlockButtonArrow {
    display: none !important;           /* ← remove arrow that crowds text */
  }

  .cl-socialButtonsProviderIcon {
    flex-shrink: 0 !important;          /* ← keep icon from squishing text */
  }
  `;

/* ═══════════════════════════════════════════════════════════
   MAIN LAYOUT SHELL (wraps auth cards)
═══════════════════════════════════════════════════════════ */
function AuthShell({ children, title, subtitle, icon = '🔑' }) {
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
        .scanline{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
        .scanline::after{content:'';position:absolute;left:0;right:0;height:3px;background:rgba(74,222,128,0.06);animation:scanMove 10s linear infinite;top:0;}

        @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
        @keyframes starTwinkle{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.15;transform:scale(0.3);}}
        @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-7px) scale(1.25);}}
        @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
        @keyframes mcFloat{0%,100%{transform:translateY(0)rotate(0deg);}40%{transform:translateY(-14px)rotate(4deg);}70%{transform:translateY(-6px)rotate(-2deg);}}
        @keyframes neonPulse{0%,100%{text-shadow:4px 4px 0 #040d07,0 0 20px rgba(74,222,128,0.4);}50%{text-shadow:4px 4px 0 #040d07,0 0 50px rgba(74,222,128,0.9),0 0 90px rgba(74,222,128,0.3);}}
        @keyframes creeperPulse{0%,100%{filter:drop-shadow(0 0 6px #4ade80);}50%{filter:drop-shadow(0 0 20px #4ade80) drop-shadow(0 0 40px #22c55e);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(28px);}to{opacity:1;transform:translateY(0);}}
        @keyframes panelReveal{from{opacity:0;transform:translateY(40px) scale(0.96);}to{opacity:1;transform:translateY(0) scale(1);}}
        @keyframes rainbowBorder{
          0%{box-shadow:8px 8px 0 #052e16, 0 0 30px rgba(74,222,128,0.3);}
          33%{box-shadow:8px 8px 0 #052e16, 0 0 30px rgba(96,165,250,0.3);}
          66%{box-shadow:8px 8px 0 #052e16, 0 0 30px rgba(167,139,250,0.3);}
          100%{box-shadow:8px 8px 0 #052e16, 0 0 30px rgba(74,222,128,0.3);}
        }
        @keyframes xpPop{0%,100%{transform:scale(1);}50%{transform:scale(1.15);}}
        @keyframes groundWiggle{0%,100%{transform:translateY(0);}50%{transform:translateY(-1px);}}
      `}</style>

      {/* Full-page background */}
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
          { t: '8%',  l: '2%',  s: 36, c: '#4ade80', d: '0s'   },
          { t: '18%', r: '3%',  s: 26, c: '#92400e', d: '1.1s' },
          { t: '55%', l: '4%',  s: 22, c: '#1d4ed8', d: '2.0s' },
          { t: '72%', r: '5%',  s: 30, c: '#dc2626', d: '0.6s' },
          { t: '40%', l: '1%',  s: 18, c: '#86efac', d: '1.7s' },
          { t: '82%', r: '8%',  s: 20, c: '#7c3aed', d: '2.4s' },
          { t: '12%', l: '88%', s: 18, c: '#fbbf24', d: '0.3s' },
          { t: '65%', l: '91%', s: 24, c: '#f472b6', d: '3.2s' },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', top: b.t, left: b.l, right: b.r,
            width: b.s, height: b.s, background: b.c,
            boxShadow: `inset -${b.s * 0.14}px -${b.s * 0.14}px 0 rgba(0,0,0,0.5),inset ${b.s * 0.09}px ${b.s * 0.09}px 0 rgba(255,255,255,0.12)`,
            animation: `mcFloat ${3.2 + i * 0.35}s ${b.d} ease-in-out infinite`,
            imageRendering: 'pixelated', zIndex: 1, opacity: 0.6,
          }} />
        ))}

        {/* Corner torches */}
        <Torch style={{ position: 'absolute', top: 24, left: 40, zIndex: 6 }} />
        <Torch style={{ position: 'absolute', top: 24, right: 40, zIndex: 6 }} />

        {/* Corner diamonds */}
        <div style={{ position: 'absolute', top: 20, left: 90, zIndex: 4 }}><DiamondOre size={32} /></div>
        <div style={{ position: 'absolute', top: 20, right: 90, zIndex: 4 }}><DiamondOre size={32} /></div>

        {/* The auth card panel */}
        <div style={{
          position: 'relative', zIndex: 10,
          width: '100%', maxWidth: 480,
          animation: 'panelReveal 0.7s cubic-bezier(0.2,0,0.2,1) both',
        }}>
          {/* Progress bar at top of card */}
          <div style={{
            height: 8, background: '#020c06',
            border: '2px solid #1a4528', borderBottom: 'none', marginBottom: 0,
          }}>
            <div style={{
              height: '100%', width: '62%',
              background: 'linear-gradient(90deg,#15803d,#22c55e,#86efac)',
              boxShadow: '0 0 12px rgba(74,222,128,0.6)',
            }} />
          </div>

          {/* Main panel */}
          <div style={{
            background: '#0b1e10',
            border: '4px solid #22c55e',
            borderTop: '2px solid #22c55e',
            animation: 'rainbowBorder 6s ease-in-out infinite',
            padding: 'clamp(20px,4vw,36px) clamp(16px,5vw,40px) 32px',
            overflow: 'visible',
          }}>
            {/* Panel header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>

              {/* Creeper mascot */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10, animation: 'creeperPulse 2.5s ease-in-out infinite' }}>
                <CreepFace size={52} />
              </div>

              {/* Title badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14,
                border: '2px solid #22c55e', padding: '6px 18px',
                fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#4ade80', letterSpacing: 2,
                background: 'rgba(21,128,61,0.15)',
                boxShadow: '0 0 18px rgba(74,222,128,0.15), 3px 3px 0 #040d07',
              }}>
                <span style={{ animation: 'xpBounce 1s ease-in-out infinite' }}>✦</span>
                {title}
                <span style={{ animation: 'xpBounce 1s 0.5s ease-in-out infinite' }}>✦</span>
              </div>

              <p style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: '#2d6a3f', marginTop: 4 }}>
                {subtitle}
                <span style={{ animation: 'mcBlink 0.9s step-end infinite', color: '#4ade80', marginLeft: 2 }}>█</span>
              </p>

              {/* XP bar divider */}
              <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginTop: 14 }}>
                {Array.from({ length: 18 }).map((_, i) => (
                  <div key={i} style={{
                    width: 12, height: 5,
                    background: i < 11 ? '#22c55e' : '#0d2a14',
                    boxShadow: i < 11 ? '0 0 5px #22c55e' : 'none',
                    animation: `xpPop ${0.4 + i * 0.04}s ease-in-out infinite`,
                    animationDelay: `${i * 0.07}s`,
                  }} />
                ))}
              </div>
            </div>

            {/* Clerk form */}
            <style>{clerkStyles}</style>
            <div style={{ width: '100%', overflow: 'visible', boxSizing: 'border-box' }}>
              {children}
            </div>

            {/* XP orbs footer */}
            <XPOrbs count={10} />
          </div>

          {/* Bottom ground strip */}
          <GroundStrip colors={['#4a8c3f', '#3a7230', '#2d5a26', '#4a8c3f']} h={12} />
          <GroundStrip colors={['#6b4226', '#8B5E3C', '#5c3d1e', '#6b4226']} h={10} />
        </div>

        {/* Bottom of page ground */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 4 }}>
          <GroundStrip colors={['#4a8c3f', '#3a7230', '#2d5a26', '#4a8c3f']} h={22} />
          <GroundStrip colors={['#6b4226', '#8B5E3C', '#5c3d1e', '#6b4226']} h={16} />
          <GroundStrip colors={['#3d2b14', '#4a3620', '#3d2b14', '#5a4228']} h={12} />
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════════ */
export default function Login() {
  return (
    <AuthShell
      title="WELCOME BACK"
      subtitle="Sign in to your RepoLink account"
    >
      <SignIn
        routing="hash"
        redirectUrl="/dashboard"
        appearance={{ layout: { socialButtonsVariant: 'blockButton' } }}
      />

      {/* Manual nav links */}
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <Link
          to="/forgot-password"
          style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#1a4a2e', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseOver={e => e.target.style.color = '#4ade80'}
          onMouseOut={e => e.target.style.color = '#1a4a2e'}
        >
          Forgot password?
        </Link>
        <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#1a4a2e' }}>
          No account?{' '}
          <Link to="/signup" style={{ color: '#4ade80', textDecoration: 'none' }}>Sign up</Link>
        </div>
      </div>
    </AuthShell>
  );
}
