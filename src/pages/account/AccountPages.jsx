import { useState, useEffect } from 'react';
import { useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { loadRazorpayScript, initiateRazorpayPayment } from '../../utils/razorpay';

/* ══════════════════════════════════════════════════
   SHARED CSS
══════════════════════════════════════════════════ */
const SHARED_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323:wght@400&display=swap');

  @keyframes xpBounce{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-5px) scale(1.15);}}
  @keyframes mcBlink{0%,100%{opacity:1;}50%{opacity:0;}}
  @keyframes mcFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  @keyframes neonPulse{0%,100%{text-shadow:2px 2px 0 #040d07,0 0 12px rgba(74,222,128,0.3);}50%{text-shadow:2px 2px 0 #040d07,0 0 28px rgba(74,222,128,0.7);}}
  @keyframes scanMove{from{transform:translateY(-100%);}to{transform:translateY(8000%);}}
  @keyframes dangerPulse{0%,100%{box-shadow:6px 6px 0 #450a0a,0 0 10px rgba(248,113,113,0.1);}50%{box-shadow:6px 6px 0 #450a0a,0 0 20px rgba(248,113,113,0.25);}}
  @keyframes saveFlash{0%{background:linear-gradient(180deg,#16a34a,#15803d);}50%{background:linear-gradient(180deg,#22c55e,#16a34a);}100%{background:linear-gradient(180deg,#16a34a,#15803d);}}

  .pg{position:absolute;inset:0;background-image:linear-gradient(rgba(74,222,128,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.02) 1px,transparent 1px);background-size:34px 34px;pointer-events:none;z-index:0;}
  .scanline{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0;}
  .scanline::after{content:'';position:absolute;left:0;right:0;height:2px;background:rgba(74,222,128,0.04);animation:scanMove 14s linear infinite;}

  .mc-card{background:#0b1e10;border:3px solid #1a4528;position:relative;overflow:hidden;padding:24px;box-shadow:4px 4px 0 #040d07;}
  .mc-card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(74,222,128,0.03) 0%,transparent 60%);pointer-events:none;}

  .mc-input{
    width:100%;padding:12px 14px;box-sizing:border-box;
    background:#020c06;border:2px solid #1a4528;
    color:#4ade80;font-family:'VT323',monospace;font-size:20px;
    outline:none;transition:border-color 0.15s,box-shadow 0.15s;
  }
  .mc-input:focus{border-color:#4ade80;box-shadow:0 0 0 2px rgba(74,222,128,0.15);}
  .mc-input::placeholder{color:#1a4528;}
  .mc-input[readonly]{opacity:0.6;cursor:default;}
  .mc-input[readonly]:focus{border-color:#1a4528;box-shadow:none;}

  .mc-textarea{
    width:100%;padding:12px 14px;box-sizing:border-box;resize:vertical;
    background:#020c06;border:2px solid #1a4528;
    color:#4ade80;font-family:'VT323',monospace;font-size:19px;
    outline:none;transition:border-color 0.15s,box-shadow 0.15s;line-height:1.6;
  }
  .mc-textarea:focus{border-color:#4ade80;box-shadow:0 0 0 2px rgba(74,222,128,0.15);}
  .mc-textarea[readonly]{opacity:0.6;cursor:default;}

  .mc-label{display:block;font-family:'Press Start 2P',monospace;font-size:7px;color:#2d6a3f;letter-spacing:1px;margin-bottom:8px;}

  .mc-btn-primary{
    display:inline-flex;align-items:center;justify-content:center;gap:6px;
    font-family:'Press Start 2P',monospace;font-size:8px;letter-spacing:1px;
    padding:11px 20px;color:#fff;cursor:pointer;
    background:linear-gradient(180deg,#16a34a,#15803d);
    border:3px solid #22c55e;box-shadow:4px 4px 0 #052e16;
    transition:all 0.1s;position:relative;overflow:hidden;
  }
  .mc-btn-primary::before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,0.1) 0%,transparent 50%);pointer-events:none;}
  .mc-btn-primary:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #052e16;}
  .mc-btn-primary:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

  .mc-btn-ghost{
    display:inline-flex;align-items:center;justify-content:center;gap:6px;
    font-family:'Press Start 2P',monospace;font-size:7px;letter-spacing:1px;
    padding:9px 16px;color:#4ade80;cursor:pointer;
    background:transparent;border:3px solid #22c55e;box-shadow:3px 3px 0 #052e16;
    transition:all 0.1s;
  }
  .mc-btn-ghost:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #052e16;background:rgba(74,222,128,0.06);}

  .mc-btn-danger{
    display:inline-flex;align-items:center;justify-content:center;gap:6px;
    font-family:'Press Start 2P',monospace;font-size:7px;letter-spacing:1px;
    padding:9px 14px;color:#f87171;cursor:pointer;
    background:transparent;border:2px solid #f87171;box-shadow:3px 3px 0 #450a0a;
    transition:all 0.1s;white-space:nowrap;
  }
  .mc-btn-danger:hover{transform:translate(-2px,-2px);box-shadow:5px 5px 0 #450a0a;background:rgba(248,113,113,0.06);}

  .settings-tab{
    display:block;width:100%;text-align:left;padding:11px 14px;
    background:transparent;color:#1a4a2e;
    border:none;border-left:3px solid transparent;
    font-family:'VT323',monospace;font-size:18px;
    cursor:pointer;transition:all 0.12s;
  }
  .settings-tab:hover{color:#4ade80;background:rgba(74,222,128,0.04);}
  .settings-tab-active{color:#4ade80!important;background:#0d2a14!important;border-left:3px solid #4ade80!important;}

  .toggle-track{width:48px;height:24px;background:#0d2a14;border:2px solid #1a4528;cursor:pointer;position:relative;transition:all 0.2s;flex-shrink:0;}
  .toggle-thumb{position:absolute;top:2px;width:16px;height:16px;transition:all 0.2s;}
  .toggle-on .toggle-track{background:#15803d;border-color:#22c55e;box-shadow:0 0 8px rgba(74,222,128,0.3);}
  .toggle-on .toggle-thumb{left:26px;background:#4ade80;}
  .toggle-off .toggle-thumb{left:2px;background:#1a4a2e;}

  .stat-row{display:flex;justify-content:space-between;padding:10px 0;border-bottom:2px solid #0d2a14;}
  .stat-row:last-child{border-bottom:none;}

  .billing-row{display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:2px solid #0d2a14;}
  .billing-row:last-child{border-bottom:none;}

  .ap-profile-grid{display:grid;grid-template-columns:1fr 2fr;gap:24px;position:relative;z-index:1;}
  .ap-settings-grid{display:grid;grid-template-columns:220px 1fr;gap:22px;position:relative;z-index:1;}

  @media (max-width: 1024px){
    .ap-profile-grid{grid-template-columns:1fr;}
    .ap-settings-grid{grid-template-columns:1fr;}
  }
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

function XPOrbs({ count = 8, style = {} }) {
  return (
    <div style={{ display: 'flex', gap: 4, ...style }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#a3e635', boxShadow: '0 0 5px #a3e635', animation: `xpBounce 1.4s ${i * 0.1}s ease-in-out infinite`, opacity: 1 - i * 0.09 }} />
      ))}
    </div>
  );
}

function SegBar({ pct, color = '#4ade80', segments = 16 }) {
  const filled = Math.round((pct / 100) * segments);
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {Array.from({ length: segments }).map((_, i) => (
        <div key={i} style={{ flex: 1, height: 7, background: i < filled ? color : '#0d2a14', boxShadow: i < filled ? `0 0 4px ${color}66` : 'none' }} />
      ))}
    </div>
  );
}

function McBadge({ children, color = '#4ade80' }) {
  return (
    <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color, border: `2px solid ${color}55`, padding: '3px 8px', background: `${color}11`, display: 'inline-block', letterSpacing: 1, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  );
}

function CornerPip({ color = '#22c55e', pos = 'tr' }) {
  const p = { tl: { top: -4, left: -4 }, tr: { top: -4, right: -4 }, bl: { bottom: -4, left: -4 }, br: { bottom: -4, right: -4 } }[pos];
  return <div style={{ position: 'absolute', width: 12, height: 12, background: color, boxShadow: `0 0 7px ${color}99`, ...p }} />;
}

function SectionLabel({ title, sub }) {
  return (
    <div style={{ marginBottom: 24, position: 'relative', zIndex: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 14, border: '2px solid #22c55e', padding: '4px 14px', fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#4ade80', letterSpacing: 2, background: 'rgba(21,128,61,0.12)', boxShadow: '3px 3px 0 #040d07' }}>
        <Torch /><span style={{ animation: 'xpBounce 1s ease-in-out infinite' }}>✦</span>
        {title}
        <span style={{ animation: 'xpBounce 1s 0.5s ease-in-out infinite' }}>✦</span><Torch />
      </div>
      {sub && <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e' }}>{sub}</div>}
    </div>
  );
}

function McField({ label, id, type = 'text', value, onChange, readonly, placeholder, rows }) {
  const isTextarea = !!rows;
  return (
    <div>
      <label className="mc-label" htmlFor={id}>{label}</label>
      {isTextarea ? (
        <textarea id={id} rows={rows} value={value} onChange={onChange} placeholder={placeholder} className="mc-textarea" readOnly={readonly} />
      ) : (
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} className="mc-input" readOnly={readonly} />
      )}
    </div>
  );
}

function Toggle({ on, onToggle, label, desc, index, total }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: index < total - 1 ? '2px solid #0d2a14' : 'none' }}>
      <div>
        <div style={{ fontFamily: "'VT323',monospace", fontSize: 19, color: '#86efac', marginBottom: 3 }}>{label}</div>
        <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#1a4a2e' }}>{desc}</div>
      </div>
      <div className={`toggle-track ${on ? 'toggle-on' : 'toggle-off'}`} onClick={onToggle}>
        <div className="toggle-thumb" />
      </div>
    </div>
  );
}

function Page({ children }) {
  return (
    <>
      <style>{SHARED_CSS}</style>
      <div style={{ background: '#040d07', minHeight: '100%', padding: '28px', position: 'relative', animation: 'fadeUp 0.4s ease both' }}>
        <div className="pg" /><div className="scanline" />
        {children}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   PROFILE
══════════════════════════════════════════════════ */
export function Profile() {
  const { user, isLoaded } = useUser();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [summary, setSummary] = useState({
    repos_analyzed: 0,
    ai_tokens_used: 0,
    credits_left: 0,
  });
  const [form, setForm] = useState({ name: '', bio: '', location: '', website: '', username: '' });

  useEffect(() => {
    if (!isLoaded || !user) return;

    let active = true;
    const loadProfile = async () => {
      try {
        const res = await api.get('/me');
        if (!active) return;

        const data = res?.data || {};
        setProfileData(data);
        setForm({
          name: user.fullName ?? '',
          username: data.username ?? user.username ?? '',
          location: data.location ?? '',
          website: data.website ?? '',
          bio: data.bio ?? '',
        });
        setLoadError('');
      } catch (err) {
        if (!active) return;

        setForm({
          name: user.fullName ?? '',
          username: user.username ?? '',
          location: '',
          website: '',
          bio: '',
        });
        setLoadError(err.message || 'Failed to load profile details.');
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, [isLoaded, user]);

  useEffect(() => {
    let active = true;
    const loadSummary = async () => {
      try {
        const res = await api.get('/dashboard-summary');
        if (!active) return;
        setSummary({
          repos_analyzed: res?.data?.repos_analyzed ?? 0,
          ai_tokens_used: res?.data?.ai_tokens_used ?? 0,
          credits_left: res?.data?.credits_left ?? 0,
        });
      } catch (_) {
        if (!active) return;
        setSummary({
          repos_analyzed: 0,
          ai_tokens_used: 0,
          credits_left: 0,
        });
      }
    };

    loadSummary();
    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      let syncWarning = '';

      const profileRes = await api.patch('/me', {
        username: form.username || undefined,
        bio: form.bio || undefined,
        location: form.location || undefined,
        website: form.website || undefined,
      });
      const profilePayload = profileRes?.data?.data ?? profileRes?.data ?? null;
      setProfileData(profilePayload);

      try {
        await user.update({
          firstName: form.name.split(' ')[0] || '',
          lastName: form.name.split(' ').slice(1).join(' ') || '',
          username: form.username || undefined,
        });
      } catch (clerkErr) {
        syncWarning =
          clerkErr?.errors?.[0]?.message ||
          'Profile saved in backend, but Clerk profile fields could not be fully synced.';
      }

      setSaved(true);
      setEditing(false);
      setLoadError(syncWarning);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setLoadError(err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl    = user?.imageUrl;
  const avatarLetter = (form.name || form.username || '?')[0]?.toUpperCase();
  const joinDate     = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—';
  const email        = user?.primaryEmailAddress?.emailAddress ?? '—';

  const STATS = [
    ['Repos Analyzed', String(summary.repos_analyzed ?? 0), '#4ade80'],
    ['AI Tokens Used', String(summary.ai_tokens_used ?? 0), '#fbbf24'],
    ['Member Since',   joinDate,  '#60a5fa'],
    ['Credits Left',   String(summary.credits_left ?? profileData?.credits ?? 0), '#a78bfa'],
  ];

  return (
    <Page>
      <SectionLabel title="YOUR PROFILE" sub="Manage your public profile information." />

      <div className="ap-profile-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Avatar card */}
          <div className="mc-card" style={{ textAlign: 'center', animation: 'fadeUp 0.4s 0.05s ease both' }}>
            <CornerPip color="#4ade80" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', marginBottom: 18, letterSpacing: 1 }}>▸ AVATAR</div>

            {/* Avatar */}
            {avatarUrl ? (
              <img src={avatarUrl} alt={form.name}
                style={{ width: 88, height: 88, margin: '0 auto 16px', display: 'block', border: '4px solid #22c55e', boxShadow: '0 0 16px rgba(74,222,128,0.3), 4px 4px 0 #052e16', objectFit: 'cover', imageRendering: 'auto' }}
              />
            ) : (
              <div style={{ width: 88, height: 88, margin: '0 auto 16px', background: '#020c06', border: '4px solid #22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Press Start 2P',monospace", fontSize: 28, color: '#4ade80', boxShadow: '0 0 16px rgba(74,222,128,0.3), 4px 4px 0 #052e16' }}>
                {avatarLetter}
              </div>
            )}

            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color: '#4ade80', animation: 'neonPulse 3s ease-in-out infinite', marginBottom: 6, lineHeight: 1.6 }}>
              {form.username || form.name || 'Player'}
            </div>
            <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#1a4a2e', marginBottom: 14 }}>{email}</div>
            <McBadge color="#fbbf24">⚔ PRO PLAN</McBadge>

            <button className="mc-btn-ghost" style={{ marginTop: 16, width: '100%', fontSize: 7 }}>
              Change Avatar
            </button>
          </div>

          {/* Stats card */}
          <div className="mc-card" style={{ animation: 'fadeUp 0.4s 0.12s ease both' }}>
            <CornerPip color="#60a5fa" />
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', marginBottom: 16, letterSpacing: 1 }}>▸ PLAYER STATS</div>
            {STATS.map(([k, v, c]) => (
              <div key={k} className="stat-row">
                <span style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#1a4a2e' }}>{k}</span>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: c }}>{v}</span>
              </div>
            ))}
            <XPOrbs count={6} style={{ marginTop: 14 }} />
          </div>
        </div>

        {/* Right column — edit form */}
        <div className="mc-card" style={{ animation: 'fadeUp 0.4s 0.08s ease both' }}>
          <CornerPip color="#a78bfa" />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#22c55e', letterSpacing: 1 }}>▸ PROFILE INFO</div>
            <button onClick={() => { setEditing(!editing); setSaved(false); }} className="mc-btn-ghost" style={{ fontSize: 7 }}>
              {editing ? '✕ CANCEL' : '✏ EDIT'}
            </button>
          </div>

          {/* Success flash */}
          {saved && (
            <div style={{ padding: '12px 16px', marginBottom: 20, background: '#0d2a14', border: '2px solid #22c55e', boxShadow: '0 0 12px rgba(74,222,128,0.2)' }}>
              <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: '#4ade80', letterSpacing: 1 }}>✓ CHANGES SAVED!</span>
            </div>
          )}

          {loadError && (
            <div style={{ padding: '12px 16px', marginBottom: 20, background: '#200505', border: '2px solid #f87171' }}>
              <span style={{ fontSize: 12, color: '#f87171', letterSpacing: 1 }}>
                WARN: {loadError}
              </span>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              { id: 'name',     label: 'DISPLAY NAME', type: 'text' },
              { id: 'username', label: 'USERNAME',      type: 'text' },
              { id: 'location', label: 'LOCATION',      type: 'text' },
              { id: 'website',  label: 'WEBSITE',       type: 'text' },
            ].map(({ id, label, type }) => (
              <McField key={id} id={id} label={label} type={type}
                value={form[id]} onChange={e => setForm(f => ({ ...f, [id]: e.target.value }))}
                readonly={!editing}
              />
            ))}

            <McField id="bio" label="BIO" rows={3}
              value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              readonly={!editing} placeholder="Tell the world about yourself..."
            />

            {/* Durability bar showing profile completeness */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1 }}>PROFILE COMPLETENESS</span>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#22c55e' }}>
                  {Math.round(([form.name, form.username, form.location, form.website, form.bio].filter(Boolean).length / 5) * 100)}%
                </span>
              </div>
              <SegBar
                pct={([form.name, form.username, form.location, form.website, form.bio].filter(Boolean).length / 5) * 100}
                color="#22c55e" segments={20}
              />
            </div>

            {editing && (
              <button onClick={handleSave} disabled={saving} className="mc-btn-primary" style={{ alignSelf: 'flex-start', fontSize: 8 }}>
                {saving ? '...' : '▶ SAVE CHANGES'}
              </button>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}

/* ══════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════ */
const TABS = [
  { id: 'account',       label: '👤 ACCOUNT',       color: '#4ade80' },
  { id: 'integrations',  label: '🔗 INTEGRATIONS',  color: '#60a5fa' },
  { id: 'notifications', label: '🔔 NOTIFICATIONS', color: '#fbbf24' },
  { id: 'billing',       label: '💳 BILLING',        color: '#a78bfa' },
  { id: 'danger',        label: '⚠ DANGER ZONE',    color: '#f87171' },
];

export function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [tab, setTab]                   = useState('account');
  const [token, setToken]               = useState('');
  const [tokenVisible, setTokenVisible] = useState(false);
  const [pwForm, setPwForm]             = useState({ current: '', next: '' });
  const [pwMsg, setPwMsg]               = useState('');
  const [pwSaving, setPwSaving]         = useState(false);
  const [notifs, setNotifs]             = useState({ analysis: true, digest: true, updates: false, credits: true });
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setIsRazorpayLoaded);
  }, []);

  const handleUpgradeToTeam = () => {
    if (!isRazorpayLoaded) {
      alert("Razorpay SDK is still loading. Please try again in a moment.");
      return;
    }

    initiateRazorpayPayment({
      amount: 69900, // ₹699.00 as requested
      name: "RepoLink Team Upgrade",
      description: "Upgrade to Team Plan",
      prefill: {
        name: user?.fullName || "",
        email: user?.primaryEmailAddress?.emailAddress || ""
      },
      onSuccess: (response) => {
        console.log("Payment Successful", response);
        alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
      }
    });
  };

  const handlePasswordChange = async () => {
    if (!pwForm.current || !pwForm.next) return;
    setPwSaving(true);
    try {
      await user.updatePassword({ currentPassword: pwForm.current, newPassword: pwForm.next });
      setPwMsg('success');
      setPwForm({ current: '', next: '' });
    } catch (e) {
      setPwMsg(e.errors?.[0]?.message ?? 'Failed to update password.');
    }
    setPwSaving(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const activeTab = TABS.find(t => t.id === tab);

  return (
    <Page>
      <SectionLabel title="SETTINGS" sub="Manage your account preferences and integrations." />

      <div className="ap-settings-grid">

        {/* Tab sidebar */}
        <div className="mc-card" style={{ padding: '8px 0', height: 'fit-content', animation: 'fadeUp 0.4s 0.05s ease both' }}>
          <CornerPip color="#22c55e" />
          <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1, padding: '8px 14px 12px', borderBottom: '2px solid #0d2a14', marginBottom: 4 }}>
            MENU
          </div>
          {TABS.map(({ id, label, color }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`settings-tab${tab === id ? ' settings-tab-active' : ''}`}
              style={{ borderLeftColor: tab === id ? color : 'transparent', color: tab === id ? color : '#1a4a2e' }}
            >
              {label}
            </button>
          ))}
          <XPOrbs count={5} style={{ padding: '10px 14px 4px' }} />
        </div>

        {/* Content area */}
        <div style={{ animation: 'fadeUp 0.4s 0.1s ease both' }}>

          {/* ── ACCOUNT ── */}
          {tab === 'account' && (
            <div className="mc-card">
              <CornerPip color="#4ade80" />
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#22c55e', marginBottom: 24, letterSpacing: 1 }}>▸ ACCOUNT SETTINGS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label className="mc-label" htmlFor="email-settings">EMAIL ADDRESS</label>
                  <input id="email-settings" type="email" value={user?.primaryEmailAddress?.emailAddress ?? ''} readOnly className="mc-input" />
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#1a4a2e', marginTop: 6 }}>Email changes are managed through Clerk's account portal.</div>
                </div>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1, height: 2, background: '#0d2a14' }} />
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1 }}>CHANGE PASSWORD</span>
                  <div style={{ flex: 1, height: 2, background: '#0d2a14' }} />
                </div>

                <McField id="current-pw" label="CURRENT PASSWORD" type="password"
                  value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))}
                  placeholder="••••••••"
                />
                <McField id="new-pw" label="NEW PASSWORD" type="password"
                  value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))}
                  placeholder="Min. 8 characters"
                />

                {/* Password strength bar */}
                {pwForm.next && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1 }}>PASSWORD STRENGTH</span>
                      <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: pwForm.next.length >= 12 ? '#4ade80' : pwForm.next.length >= 8 ? '#fbbf24' : '#f87171' }}>
                        {pwForm.next.length >= 12 ? 'STRONG' : pwForm.next.length >= 8 ? 'OK' : 'WEAK'}
                      </span>
                    </div>
                    <SegBar
                      pct={Math.min((pwForm.next.length / 16) * 100, 100)}
                      color={pwForm.next.length >= 12 ? '#4ade80' : pwForm.next.length >= 8 ? '#fbbf24' : '#f87171'}
                      segments={16}
                    />
                  </div>
                )}

                {/* Password result message */}
                {pwMsg && (
                  <div style={{ padding: '12px 16px', background: pwMsg === 'success' ? '#0d2a14' : '#200505', border: `2px solid ${pwMsg === 'success' ? '#22c55e' : '#f87171'}` }}>
                    <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color: pwMsg === 'success' ? '#4ade80' : '#f87171', letterSpacing: 1 }}>
                      {pwMsg === 'success' ? '✓ PASSWORD UPDATED!' : `⚠ ${pwMsg}`}
                    </span>
                  </div>
                )}

                <button onClick={handlePasswordChange} disabled={pwSaving || !pwForm.current || !pwForm.next} className="mc-btn-primary" style={{ alignSelf: 'flex-start', fontSize: 8 }}>
                  {pwSaving ? '...' : '▶ UPDATE PASSWORD'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 6 }}>
                  <div style={{ flex: 1, height: 2, background: '#0d2a14' }} />
                  <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1 }}>SESSION</span>
                  <div style={{ flex: 1, height: 2, background: '#0d2a14' }} />
                </div>

                <button onClick={handleLogout} className="mc-btn-danger" style={{ alignSelf: 'flex-start', fontSize: 8 }}>
                  ⏻ LOG OUT
                </button>
              </div>
            </div>
          )}

          {/* ── INTEGRATIONS ── */}
          {tab === 'integrations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* GitHub token */}
              <div className="mc-card">
                <CornerPip color="#60a5fa" />
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#22c55e', marginBottom: 16, letterSpacing: 1 }}>▸ GITHUB TOKEN</div>
                <p style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#2d6a3f', marginBottom: 18, lineHeight: 1.7 }}>
                  Required for analyzing private repositories. Your token is encrypted and never logged.
                </p>
                <label className="mc-label" htmlFor="gh-token">PERSONAL ACCESS TOKEN</label>
                <div style={{ display: 'flex', marginBottom: 16 }}>
                  <input id="gh-token" type={tokenVisible ? 'text' : 'password'}
                    value={token} onChange={e => setToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="mc-input" style={{ flex: 1, borderRight: 'none' }}
                  />
                  <button onClick={() => setTokenVisible(!tokenVisible)} style={{ background: '#020c06', border: '2px solid #1a4528', borderLeft: 'none', color: '#4ade80', cursor: 'pointer', padding: '0 14px', fontSize: 18, transition: 'all 0.12s' }}>
                    {tokenVisible ? '🙈' : '👁'}
                  </button>
                </div>
                <button className="mc-btn-primary" style={{ fontSize: 8 }}>▶ SAVE TOKEN</button>
              </div>

              {/* Other providers */}
              {[
                { icon: '🦊', name: 'GITLAB',     status: 'Not connected', color: '#f97316' },
                { icon: '🪣', name: 'BITBUCKET',  status: 'Not connected', color: '#60a5fa' },
              ].map(({ icon, name, status, color }) => (
                <div key={name} className="mc-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CornerPip color={color} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, background: '#020c06', border: `2px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color, marginBottom: 5, letterSpacing: 1 }}>{name}</div>
                      <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#1a4a2e' }}>{status}</div>
                    </div>
                  </div>
                  <button className="mc-btn-ghost" style={{ fontSize: 7 }}>Connect →</button>
                </div>
              ))}
            </div>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'notifications' && (
            <div className="mc-card">
              <CornerPip color="#fbbf24" />
              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#22c55e', marginBottom: 24, letterSpacing: 1 }}>▸ NOTIFICATION PREFERENCES</div>
              {[
                { key: 'analysis', label: 'Analysis complete',  desc: 'Get notified when a repo analysis finishes' },
                { key: 'digest',   label: 'Weekly digest',      desc: 'Summary of all your activity each week' },
                { key: 'updates',  label: 'Product updates',    desc: 'New features and improvements' },
                { key: 'credits',  label: 'Credit low warning', desc: 'Alert when credits fall below 50' },
              ].map(({ key, label, desc }, i, arr) => (
                <Toggle key={key} on={notifs[key]} onToggle={() => setNotifs(n => ({ ...n, [key]: !n[key] }))}
                  label={label} desc={desc} index={i} total={arr.length}
                />
              ))}
              <XPOrbs count={6} style={{ marginTop: 16 }} />
            </div>
          )}

          {/* ── BILLING ── */}
          {tab === 'billing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Current plan */}
              <div className="mc-card" style={{ border: '3px solid #fbbf24', boxShadow: '4px 4px 0 #040d07, 0 0 16px rgba(251,191,36,0.15)' }}>
                <CornerPip color="#fbbf24" />
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#22c55e', marginBottom: 16, letterSpacing: 1 }}>▸ CURRENT PLAN</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div>
                    <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 14, color: '#fbbf24', animation: 'neonPulse 3s ease-in-out infinite', marginBottom: 8, lineHeight: 1.6 }}>
                      PRO PLAN
                    </div>
                    <div style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e' }}>$12 / month · Renews Mar 19, 2026</div>
                  </div>
                  <McBadge color="#4ade80">✓ ACTIVE</McBadge>
                </div>

                {/* Credits remaining bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#1a4a2e', letterSpacing: 1 }}>CREDITS REMAINING</span>
                    <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#fbbf24' }}>420 / 500</span>
                  </div>
                  <SegBar pct={84} color="#fbbf24" segments={20} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={handleUpgradeToTeam} className="mc-btn-primary" style={{ fontSize: 7 }}>Upgrade to Team</button>
                  <button className="mc-btn-danger" style={{ fontSize: 7 }}>Cancel Plan</button>
                </div>
              </div>

              {/* Billing history */}
              <div className="mc-card">
                <CornerPip color="#a78bfa" />
                <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#22c55e', marginBottom: 16, letterSpacing: 1 }}>▸ BILLING HISTORY</div>
                {[
                  ['Feb 19, 2026', 'Pro Plan', '$12.00', '#4ade80'],
                  ['Jan 19, 2026', 'Pro Plan', '$12.00', '#4ade80'],
                  ['Dec 19, 2025', 'Pro Plan', '$12.00', '#4ade80'],
                ].map(([date, desc, amt, c]) => (
                  <div key={date} className="billing-row">
                    <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#1a4a2e' }}>{date}</span>
                    <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#2d6a3f' }}>{desc}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: c }}>{amt}</span>
                      <button style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 5, color: '#1a4a2e', background: 'transparent', border: '1px solid #1a4528', padding: '3px 7px', cursor: 'pointer', transition: 'all 0.12s' }}
                        onMouseOver={e => { e.currentTarget.style.color = '#4ade80'; e.currentTarget.style.borderColor = '#4ade80'; }}
                        onMouseOut={e => { e.currentTarget.style.color = '#1a4a2e'; e.currentTarget.style.borderColor = '#1a4528'; }}
                      >↓ PDF</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── DANGER ZONE ── */}
          {tab === 'danger' && (
            <div className="mc-card"
              style={{
                border: '3px solid #f87171',
                boxShadow: '6px 6px 0 #450a0a',
                animation: 'dangerPulse 4s ease-in-out infinite',
              }}
            >
              {/* All 4 corners red */}
              {['tl','tr','bl','br'].map(pos => <CornerPip key={pos} color="#f87171" pos={pos} />)}

              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 8, color: '#f87171', marginBottom: 24, letterSpacing: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ animation: 'xpBounce 1s ease-in-out infinite' }}>⚠</span> DANGER ZONE <span style={{ animation: 'xpBounce 1s 0.5s ease-in-out infinite' }}>⚠</span>
              </div>

              <div style={{ marginBottom: 16, padding: '12px 16px', background: '#200505', border: '2px solid #7f1d1d' }}>
                <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#fca5a5', lineHeight: 1.6 }}>
                  Actions in this section are <strong>permanent and cannot be undone</strong>. Proceed with extreme caution.
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { title: 'DELETE ALL ANALYSIS HISTORY', desc: 'This will permanently delete all saved repo analyses. This cannot be undone.', btn: '🗑 Delete History',   color: '#f97316' },
                  { title: 'DELETE MY ACCOUNT',           desc: 'Permanently delete your account and all associated data. This action is irreversible.', btn: '💀 Delete Account', color: '#f87171' },
                ].map(({ title, desc, btn, color }, i, arr) => (
                  <div key={title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 0', borderBottom: i < arr.length - 1 ? '2px solid #2a0707' : 'none', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 7, color, marginBottom: 10, letterSpacing: 1 }}>{title}</div>
                      <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#9a3535', lineHeight: 1.6 }}>{desc}</div>
                    </div>
                    <button className="mc-btn-danger" style={{ borderColor: color, color, boxShadow: `3px 3px 0 #450a0a` }}
                      onClick={() => alert(`${btn} (demo — no action taken)`)}
                    >
                      {btn}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <XPOrbs count={8} style={{ marginTop: 22, position: 'relative', zIndex: 1 }} />
    </Page>
  );
}
