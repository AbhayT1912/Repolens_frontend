import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import emailjs from "@emailjs/browser";
import { loadRazorpayScript, initiateRazorpayPayment } from '../../utils/razorpay';

/* ══════════════════════════════════════════════════
   SCROLL REVEAL HOOK
══════════════════════════════════════════════════ */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ══════════════════════════════════════════════════
   SHARED PIXEL ATOMS
══════════════════════════════════════════════════ */
function GroundStrip({ colors, h }) {
  return (
    <div style={{ display: "flex", height: h, width: "100%", flexShrink: 0 }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: "1 0 0",
            background: colors[i % colors.length],
            boxShadow:
              "inset -2px -2px 0 rgba(0,0,0,0.25), inset 2px 2px 0 rgba(255,255,255,0.07)",
            borderRight: "1px solid rgba(0,0,0,0.12)",
          }}
        />
      ))}
    </div>
  );
}

function NightSky() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {Array.from({ length: 25 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: i % 4 === 0 ? 4 : 2,
            height: i % 4 === 0 ? 4 : 2,
            background: "#fff",
            opacity: 0.5,
            top: `${(i * 7.3) % 55}%`,
            left: `${(i * 11.7) % 95}%`,
            animation: `starTwinkle ${1.5 + (i % 5) * 0.3}s ${(i * 0.3) % 2.5}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

function DiamondOre({ size = 40 }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setPhase(p => (p + 1) % 4), 500);
    return () => clearInterval(id);
  }, []);
  const glows = [
    "drop-shadow(0 0 3px #00d4ff)",
    "drop-shadow(0 0 8px #00d4ff)",
    "drop-shadow(0 0 6px #00eeff)",
    "drop-shadow(0 0 4px #00d4ff)",
  ];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      style={{
        imageRendering: "pixelated",
        filter: glows[phase],
        transition: "filter 0.4s",
      }}
    >
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

/* Shared pixel CTA button */
function McBtn({ to, children, primary = true, style = {} }) {
  return (
    <Link
      to={to}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'Press Start 2P',monospace",
        fontSize: 8,
        letterSpacing: 1,
        padding: "14px 32px",
        textDecoration: "none",
        color: primary ? "#fff" : "#4ade80",
        background: primary
          ? "linear-gradient(180deg,#16a34a,#15803d)"
          : "transparent",
        border: "3px solid #22c55e",
        boxShadow: "6px 6px 0 #052e16",
        transition: "all 0.1s",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = "translate(-3px,-3px)";
        e.currentTarget.style.boxShadow = "9px 9px 0 #052e16";
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "6px 6px 0 #052e16";
      }}
    >
      <span
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg,rgba(255,255,255,0.1) 0%,transparent 50%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </Link>
  );
}

/* Section hero banner */
function PageHero({ badge, title, sub }) {
  return (
    <section
      style={{
        padding: "24px clamp(16px,6vw,80px) 0",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg,#000a04 0%,#040d07 100%)",
        textAlign: "center",
      }}
    >
      <div className="pg" />
      <div className="scanline" />
      <NightSky />
      <div style={{ position: "relative", zIndex: 2, paddingBottom: 60 }}>
        <div className="sec-badge" style={{ marginBottom: 22 }}>
          <span style={{ animation: "xpBounce 1s ease-in-out infinite" }}>
            ✦
          </span>
          {badge}
          <span style={{ animation: "xpBounce 1s 0.5s ease-in-out infinite" }}>
            ✦
          </span>
        </div>
        <h1
          style={{
            fontFamily: "'Press Start 2P',monospace",
            fontSize: "clamp(13px,2.2vw,22px)",
            color: "#4ade80",
            textShadow: "4px 4px 0 #040d07",
            animation: "neonPulse 3s ease-in-out infinite",
            lineHeight: 1.7,
            marginBottom: 18,
          }}
        >
          {title}
        </h1>
        {sub && (
          <p
            style={{
              fontFamily: "'VT323',monospace",
              fontSize: 21,
              color: "#2d6a3f",
              maxWidth: 600,
              margin: "0 auto",
            }}
          >
            {sub}
          </p>
        )}
        {/* XP bar */}
        <div
          style={{
            display: "flex",
            gap: 3,
            justifyContent: "center",
            marginTop: 22,
          }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 12,
                height: 5,
                background: i < 14 ? "#22c55e" : "#0d2a14",
                boxShadow: i < 14 ? "0 0 5px #22c55e" : "none",
                animation: `xpPop ${0.4 + i * 0.03}s ${i * 0.06}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>
      <GroundStrip
        colors={["#4a8c3f", "#3a7230", "#2d5a26", "#4a8c3f"]}
        h={12}
      />
      <GroundStrip
        colors={["#6b4226", "#8B5E3C", "#5c3d1e", "#6b4226"]}
        h={9}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   USE CASES
═══════════════════════════════════════════════════ */
const CASES = [
  {
    icon: "🧑‍💼",
    role: "New Team Member",
    headline: "Onboard in hours, not weeks",
    desc: 'Get dropped into a 200k line codebase? RepoLink maps the architecture, explains key modules, and answers your "wait, what does THIS do?" questions instantly.',
    tags: ["Onboarding", "Architecture"],
    color: "#4ade80",
  },
  {
    icon: "🔍",
    role: "Code Reviewer",
    headline: "Review PRs with full context",
    desc: "Before reviewing a pull request, understand exactly which functions are affected, what calls them, and what the blast radius of a change is.",
    tags: ["Pull Requests", "Impact Analysis"],
    color: "#60a5fa",
  },
  {
    icon: "🐛",
    role: "Bug Hunter",
    headline: "Trace bugs through call graphs",
    desc: "Follow a bug upstream through callers and callees. RepoLink makes it trivial to trace the entire execution path from symptom to root cause.",
    tags: ["Debugging", "Call Graph"],
    color: "#f87171",
  },
  {
    icon: "📦",
    role: "OSS Contributor",
    headline: "Contribute to open source confidently",
    desc: "Before opening a PR on a large OSS project, understand the conventions, architecture, and how your change fits into the whole.",
    tags: ["Open Source", "Contribution"],
    color: "#fbbf24",
  },
  {
    icon: "📚",
    role: "Tech Lead / Architect",
    headline: "Get a bird's eye view",
    desc: "Use analytics and call graphs to identify technical debt hotspots, over-coupled modules, and candidates for refactoring — backed by data.",
    tags: ["Architecture", "Tech Debt"],
    color: "#a78bfa",
  },
  {
    icon: "🎓",
    role: "Student / Learner",
    headline: "Learn from real codebases",
    desc: "Study how production systems are built. Ask AI to explain patterns, walk through algorithms, and understand real-world engineering decisions.",
    tags: ["Learning", "Education"],
    color: "#34d399",
  },
];

export function UseCases() {
  useScrollReveal();
  return (
    <div style={{ background: "#040d07" }}>
      <PageHero
        badge="WHO IS THIS FOR"
        title="WHO IS THIS FOR?"
        sub='RepoLink is built for every developer who has ever stared at an unfamiliar codebase and thought "where do I even start?"'
      />

      <section
        style={{
          padding: "clamp(28px,6vw,80px)",
          background: "#050f08",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="pg" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 24,
          }}
        >
          {CASES.map(({ icon, role, headline, desc, tags, color }, i) => (
            <div
              key={i}
              data-reveal
              data-d={`${(i % 3) + 1}`}
              style={{
                background: "#0b1e10",
                border: "3px solid #1a4528",
                padding: "28px",
                position: "relative",
                overflow: "hidden",
                transition: "all 0.18s",
                cursor: "default",
                animation: `fadeUp 0.5s ${i * 0.08}s ease both`,
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = color;
                e.currentTarget.style.transform = "translate(-4px,-4px)";
                e.currentTarget.style.boxShadow = `8px 8px 0 #040d07, 0 0 24px ${color}33`;
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = "#1a4528";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Corner pip */}
              <div
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  width: 18,
                  height: 18,
                  background: color,
                  boxShadow: `0 0 8px ${color}99`,
                }}
              />

              <div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>

              {/* Role badge */}
              <div
                style={{
                  fontFamily: "'Press Start 2P',monospace",
                  fontSize: 6,
                  color,
                  marginBottom: 10,
                  letterSpacing: 1,
                  border: `1px solid ${color}44`,
                  display: "inline-block",
                  padding: "3px 8px",
                  background: `${color}11`,
                }}
              >
                {role}
              </div>

              <h3
                style={{
                  fontFamily: "'Press Start 2P',monospace",
                  fontSize: 8,
                  color: "#86efac",
                  marginBottom: 14,
                  lineHeight: 1.7,
                }}
              >
                {headline}
              </h3>
              <p
                style={{
                  fontFamily: "'VT323',monospace",
                  fontSize: 18,
                  color: "#2d6a3f",
                  lineHeight: 1.7,
                  marginBottom: 18,
                }}
              >
                {desc}
              </p>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {tags.map(t => (
                  <span
                    key={t}
                    style={{
                      fontFamily: "'Press Start 2P',monospace",
                      fontSize: 6,
                      color,
                      border: `2px solid ${color}55`,
                      padding: "4px 10px",
                      background: `${color}0f`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Bottom durability bar */}
              <div
                style={{
                  height: 5,
                  background: "#040d07",
                  border: "2px solid #1a4528",
                  marginTop: 18,
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${55 + i * 7}%`,
                    background: `linear-gradient(90deg,${color}88,${color})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <GroundStrip colors={["#4a8c3f", "#3a7230", "#4a8c3f"]} h={12} />
      <GroundStrip colors={["#6b4226", "#8B5E3C", "#6b4226"]} h={9} />

      <section
        style={{
          padding: "clamp(28px,6vw,80px)",
          textAlign: "center",
          background: "#020a05",
          position: "relative",
        }}
      >
        <div className="pg" />
        <div data-reveal>
          <McBtn to="/signup">▶ Try It Free</McBtn>
        </div>
      </section>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PRICING
═══════════════════════════════════════════════════ */
const PLANS = [
  {
    name: "FREE",
    price: "$0",
    period: "/month",
    color: "#4ade80",
    border: "#1a4528",
    features: [
      "3 public repo analyses/month",
      "50 AI questions/month",
      "Call graph (basic)",
      "File structure view",
      "7-day history",
    ],
    cta: "Start Free",
    link: "/signup",
    primary: false,
  },
  {
    name: "PRO",
    price: "$12",
    period: "/month",
    color: "#4ade80",
    border: "#22c55e",
    highlight: true,
    features: [
      "Unlimited public repos",
      "10 private repos/month",
      "2,000 AI questions/month",
      "Full call graph + analytics",
      "Unlimited history",
      "Priority processing",
    ],
    cta: "▶ Start Pro",
    link: "/signup?plan=pro",
    primary: true,
  },
  {
    name: "TEAM",
    price: "$49",
    period: "/month",
    color: "#a78bfa",
    border: "#7c3aed",
    features: [
      "Everything in Pro",
      "Up to 10 seats",
      "Unlimited private repos",
      "Shared team history",
      "Org-level analytics",
      "Slack integration",
      "Priority support",
    ],
    cta: "Start Team Trial",
    link: "/signup?plan=team",
    primary: false,
  },
];

export function Pricing() {
  useScrollReveal();
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    loadRazorpayScript().then(setIsRazorpayLoaded);
  }, []);

  const handlePlanClick = (e, plan) => {
    e.preventDefault();
    if (!isRazorpayLoaded) {
      alert("Razorpay SDK is still loading. Please try again in a moment.");
      return;
    }

    // Default amount from user request: ₹699.00 (69900 paise)
    // In a real app, this would be based on the plan.price
    initiateRazorpayPayment({
      amount: 69900, 
      name: `RepoLink ${plan.name} Plan`,
      description: `Upgrade to ${plan.name} Plan`,
      onSuccess: (response) => {
        console.log("Payment Successful", response);
        alert(`Payment successful! ID: ${response.razorpay_payment_id}`);
      }
    });
  };

  return (
    <div style={{ background: "#040d07" }}>
      <PageHero
        badge="SIMPLE PRICING"
        title="SIMPLE PRICING"
        sub="No hidden blocks. No dark patterns. Cancel anytime."
      />

      <section
        style={{
          padding: "clamp(28px,6vw,80px)",
          background: "#050f08",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="pg" />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 28, maxWidth: 1100, margin: '0 auto', alignItems: 'stretch' }}>
          {PLANS.map(({ name, price, period, color, border, highlight, features, cta, link, primary }, i) => (
            <div key={name} data-reveal data-d={`${i + 1}`}
              style={{
                background: '#0b1e10',
                border: `4px solid ${border}`,
                boxShadow: highlight ? `8px 8px 0 #052e16, 0 0 40px rgba(74,222,128,0.2)` : '6px 6px 0 #052e16',
                padding: '32px',
                position: 'relative',
                transform: 'none',
                transition: 'all 0.18s',
                animation: `rainbowBorder ${highlight ? '5s' : 'none'} ease-in-out infinite`,
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseOver={e => { if (!highlight) { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translate(-3px,-3px)'; } }}
              onMouseOut={e => { if (!highlight) { e.currentTarget.style.borderColor = border; e.currentTarget.style.transform = 'none'; } }}
            >
              {/* Most popular badge */}
              {highlight && (
                <div style={{
                  position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(180deg,#16a34a,#15803d)',
                  border: '2px solid #22c55e', padding: '5px 16px',
                  fontFamily: "'Press Start 2P',monospace", fontSize: 6, color: '#fff',
                  whiteSpace: 'nowrap', boxShadow: '3px 3px 0 #052e16',
                }}>
                  ★ MOST POPULAR
                </div>
              )}

              {/* Corner ore */}
              <div style={{ position: 'absolute', top: -5, right: -5, width: 18, height: 18, background: color, boxShadow: `0 0 10px ${color}88` }} />

              <div style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 9, color, marginBottom: 18, letterSpacing: 2 }}>{name}</div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 6 }}>
                <span style={{ fontFamily: "'Press Start 2P',monospace", fontSize: 28, color, textShadow: `3px 3px 0 #040d07` }}>{price}</span>
                <span style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#1a4a2e', paddingBottom: 4 }}>{period}</span>
              </div>

              {/* Divider */}
              <div style={{ height: 3, background: '#1a4528', margin: '18px 0', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: '70%', background: color, opacity: 0.4 }} />
              </div>

              {/* Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, flex: 1 }}>
                {features.map((f, j) => (
                  <div key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: "'VT323',monospace", fontSize: 18, color: '#2d6a3f' }}>
                    <span style={{ color, flexShrink: 0, fontSize: 14 }}>✓</span>
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button 
                onClick={(e) => handlePlanClick(e, { name, price })}
                style={{
                  display: 'block', width: '100%', textAlign: 'center',
                  fontFamily: "'Press Start 2P',monospace", fontSize: 8, letterSpacing: 1,
                  padding: '13px', textDecoration: 'none',
                  color: primary ? '#fff' : color,
                  background: primary ? 'linear-gradient(180deg,#16a34a,#15803d)' : 'transparent',
                  border: `3px solid ${color}`,
                  boxShadow: `4px 4px 0 #052e16`,
                  transition: 'all 0.1s',
                  cursor: 'pointer'
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translate(-2px,-2px)'; e.currentTarget.style.boxShadow = `6px 6px 0 #052e16`; }}
                onMouseOut={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `4px 4px 0 #052e16`; }}
              >
                {cta}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <div data-reveal style={{ textAlign: "center", marginTop: 56 }}>
          <p
            style={{
              fontFamily: "'VT323',monospace",
              fontSize: 19,
              color: "#1a4a2e",
            }}
          >
            All plans include a 14-day trial. No credit card required for Free
            tier.
            <br />
            Questions?{" "}
            <Link
              to="/contact"
              style={{
                color: "#22c55e",
                fontFamily: "'Press Start 2P',monospace",
                fontSize: 7,
              }}
            >
              Contact us →
            </Link>
          </p>
        </div>
      </section>

      <GroundStrip colors={["#4a8c3f", "#3a7230", "#4a8c3f"]} h={12} />
      <GroundStrip colors={["#6b4226", "#8B5E3C", "#6b4226"]} h={9} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════════ */
const VALUES = [
  {
    icon: "🚀",
    title: "Speed First",
    desc: "Analysis in under 60 seconds. Always. No exceptions.",
  },
  {
    icon: "🔒",
    title: "Privacy by Default",
    desc: "Your code never trains our models. Ever.",
  },
  {
    icon: "🌍",
    title: "Accessible",
    desc: "Free tier forever. No credit card required.",
  },
  {
    icon: "🧩",
    title: "Composable",
    desc: "API-first so you can build on top of us.",
  },
];

export function About() {
  useScrollReveal();
  return (
    <div style={{ background: "#040d07" }}>
      <PageHero badge="OUR STORY" title="ABOUT REPOLINK" />

      {/* Story */}
      <section
        style={{
          padding: "clamp(28px,6vw,80px)",
          maxWidth: 860,
          margin: "0 auto",
          position: "relative",
        }}
      >
        <div
          data-reveal
          style={{
            background: "#0b1e10",
            border: "3px solid #1a4528",
            padding: "40px",
            marginBottom: 40,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: 6,
              height: "100%",
              background: "linear-gradient(180deg,#4ade80,#15803d,#4ade80)",
            }}
          />
          <div style={{ paddingLeft: 20 }}>
            {[
              "RepoLink was born out of frustration. We were a small team dropped into a 400k line legacy monolith with zero documentation. It took months to understand enough to ship safely. We built RepoLink so no developer ever has to go through that again.",
              "We use a combination of static analysis, AST parsing, and large language models to build a comprehensive understanding of any codebase — then make that understanding accessible through interactive visuals and natural language Q&A.",
              "Our team is remote-first, open-source-friendly, and obsessed with developer tooling. We eat our own dogfood: RepoLink is analyzed by RepoLink every single day.",
            ].map((p, i) => (
              <p
                key={i}
                style={{
                  fontFamily: "'VT323',monospace",
                  fontSize: 20,
                  color: "#2d6a3f",
                  lineHeight: 1.8,
                  marginBottom: i < 2 ? 20 : 0,
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* Values */}
        <div data-reveal style={{ marginTop: 60 }}>
          <div className="sec-badge" style={{ marginBottom: 32 }}>
            ✦ OUR VALUES ✦
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 20,
            }}
          >
            {VALUES.map(({ icon, title, desc }, i) => (
              <div
                key={title}
                data-reveal
                data-d={`${i + 1}`}
                style={{
                  background: "#0b1e10",
                  border: "3px solid #1a4528",
                  padding: "24px",
                  transition: "all 0.18s",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = "#4ade80";
                  e.currentTarget.style.transform = "translate(-3px,-3px)";
                  e.currentTarget.style.boxShadow =
                    "6px 6px 0 #040d07, 0 0 20px rgba(74,222,128,0.2)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = "#1a4528";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    width: 16,
                    height: 16,
                    background: "#4ade80",
                    boxShadow: "0 0 8px #4ade8099",
                  }}
                />
                <div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P',monospace",
                    fontSize: 8,
                    color: "#4ade80",
                    marginBottom: 10,
                    lineHeight: 1.6,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontFamily: "'VT323',monospace",
                    fontSize: 18,
                    color: "#2d6a3f",
                    lineHeight: 1.6,
                  }}
                >
                  {desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team stat row */}
        <div
          data-reveal
          style={{
            marginTop: 56,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))",
            gap: 20,
          }}
        >
          {[
            { val: "2023", label: "Founded" },
            { val: "100%", label: "Remote" },
            { val: "∞", label: "Dog food eaten" },
          ].map(({ val, label }) => (
            <div
              key={label}
              style={{
                background: "#0b1e10",
                border: "3px solid #1a4528",
                padding: "22px",
                textAlign: "center",
                boxShadow: "4px 4px 0 #040d07",
              }}
            >
              <div
                style={{
                  fontFamily: "'Press Start 2P',monospace",
                  fontSize: 20,
                  color: "#4ade80",
                  textShadow: "2px 2px 0 #040d07",
                  marginBottom: 8,
                }}
              >
                {val}
              </div>
              <div
                style={{
                  fontFamily: "'VT323',monospace",
                  fontSize: 17,
                  color: "#1a4a2e",
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <GroundStrip colors={["#4a8c3f", "#3a7230", "#4a8c3f"]} h={12} />
      <GroundStrip colors={["#6b4226", "#8B5E3C", "#6b4226"]} h={9} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT
═══════════════════════════════════════════════════ */
const CONTACT_INFO = [
  { icon: "📧", title: "Email", val: "hello@repolink.dev" },
  { icon: "🐦", title: "Twitter / X", val: "@RepoLink" },
  { icon: "💬", title: "Discord", val: "discord.gg/repolink" },
  { icon: "⏱", title: "Response Time", val: "Within 24 hours" },
];

export function Contact() {
  useScrollReveal();

  const [sent, setSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      await emailjs.send(
        "service_c9oigrf",
        "template_4ydhe6p",
        {
          from_name: formData.name,
          to_name: "RepoLens",
          from_email: formData.email,
          to_email: "aashutosh.developer@gmail.com",
          message: formData.message,
        },
        "-GMabLQ5pzVhK1Fi2",
      );

      setSent(true);
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.log("EmailJS error:", error);
    }
  };

  return (
    <div style={{ background: "#040d07" }}>
      <PageHero
        badge="GET IN TOUCH"
        title="GET IN TOUCH"
        sub="Questions, feedback, or partnership inquiries — we read every message."
      />

      <section
        style={{
          padding: "clamp(28px,6vw,80px)",
          background: "#050f08",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div className="pg" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: 32,
            maxWidth: 1000,
            margin: "0 auto",
          }}
        >
          {/* ── Form ── */}
          <div data-reveal>
            <div className="sec-badge" style={{ marginBottom: 28 }}>
              ✦ SEND A MESSAGE ✦
            </div>

            {sent ? (
              <div
                style={{
                  background: "#0b1e10",
                  border: "3px solid #22c55e",
                  padding: "40px",
                  textAlign: "center",
                  boxShadow: "6px 6px 0 #040d07",
                }}
              >
                <div
                  style={{
                    fontSize: 52,
                    marginBottom: 16,
                    animation: "mcFloat 2s ease-in-out infinite",
                  }}
                >
                  📬
                </div>
                <div
                  style={{
                    fontFamily: "'Press Start 2P',monospace",
                    fontSize: 9,
                    color: "#4ade80",
                    lineHeight: 1.7,
                    marginBottom: 12,
                  }}
                >
                  MESSAGE SENT!
                </div>
                <p
                  style={{
                    fontFamily: "'VT323',monospace",
                    fontSize: 19,
                    color: "#2d6a3f",
                  }}
                >
                  We'll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                style={{ display: "flex", flexDirection: "column", gap: 20 }}
                onSubmit={handleSubmit}
              >
                {[
                  {
                    id: "name",
                    label: "YOUR NAME",
                    type: "text",
                    ph: "Steve Miner",
                  },
                  {
                    id: "email",
                    label: "EMAIL ADDRESS",
                    type: "email",
                    ph: "steve@example.com",
                  },
                ].map(({ id, label, type, ph }) => (
                  <div key={id}>
                    <label
                      style={{
                        display: "block",
                        fontFamily: "'Press Start 2P',monospace",
                        fontSize: 7,
                        color: "#2d6a3f",
                        letterSpacing: 1,
                        marginBottom: 8,
                      }}
                    >
                      {label}
                    </label>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      placeholder={ph}
                      required
                      value={formData[id]}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        background: "#020c06",
                        border: "2px solid #1a4528",
                        color: "#4ade80",
                        fontFamily: "'VT323',monospace",
                        fontSize: 20,
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      onFocus={e => (e.target.style.borderColor = "#4ade80")}
                      onBlur={e => (e.target.style.borderColor = "#1a4528")}
                    />
                  </div>
                ))}

                <div>
                  <label
                    style={{
                      display: "block",
                      fontFamily: "'Press Start 2P',monospace",
                      fontSize: 7,
                      color: "#2d6a3f",
                      letterSpacing: 1,
                      marginBottom: 8,
                    }}
                  >
                    MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      background: "#020c06",
                      border: "2px solid #1a4528",
                      color: "#4ade80",
                      fontFamily: "'VT323',monospace",
                      fontSize: 20,
                      outline: "none",
                      resize: "vertical",
                      boxSizing: "border-box",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#4ade80")}
                    onBlur={e => (e.target.style.borderColor = "#1a4528")}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    fontFamily: "'Press Start 2P',monospace",
                    fontSize: 9,
                    letterSpacing: 1,
                    padding: "14px 28px",
                    color: "#fff",
                    cursor: "pointer",
                    background: "linear-gradient(180deg,#16a34a,#15803d)",
                    border: "3px solid #22c55e",
                    boxShadow: "5px 5px 0 #052e16",
                    transition: "all 0.1s",
                    alignSelf: "flex-start",
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.transform = "translate(-2px,-2px)";
                    e.currentTarget.style.boxShadow = "7px 7px 0 #052e16";
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "5px 5px 0 #052e16";
                  }}
                >
                  ▶ SEND MESSAGE
                </button>
              </form>
            )}
          </div>

          {/* ── Info cards ── */}
          <div
            data-reveal
            data-d="2"
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            <div className="sec-badge" style={{ marginBottom: 12 }}>
              ✦ FIND US ✦
            </div>
            {CONTACT_INFO.map(({ icon, title, val }, i) => (
              <div
                key={title}
                style={{
                  background: "#0b1e10",
                  border: "3px solid #1a4528",
                  padding: "18px 22px",
                  display: "flex",
                  gap: 18,
                  alignItems: "center",
                  boxShadow: "4px 4px 0 #040d07",
                  transition: "all 0.18s",
                  animation: `fadeUp 0.4s ${i * 0.1}s ease both`,
                }}
                onMouseOver={e => {
                  e.currentTarget.style.borderColor = "#4ade80";
                  e.currentTarget.style.transform = "translate(-3px,-3px)";
                  e.currentTarget.style.boxShadow = "7px 7px 0 #040d07";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.borderColor = "#1a4528";
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "4px 4px 0 #040d07";
                }}
              >
                <div
                  className="inv-slot"
                  style={{
                    width: 46,
                    height: 46,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Press Start 2P',monospace",
                      fontSize: 6,
                      color: "#1a4a2e",
                      marginBottom: 6,
                      letterSpacing: 1,
                    }}
                  >
                    {title}
                  </div>
                  <div
                    style={{
                      fontFamily: "'VT323',monospace",
                      fontSize: 20,
                      color: "#4ade80",
                    }}
                  >
                    {val}
                  </div>
                </div>
              </div>
            ))}

            <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: "#a3e635",
                    boxShadow: "0 0 5px #a3e635",
                    animation: `xpBounce 1.4s ${i * 0.1}s ease-in-out infinite`,
                    opacity: 1 - i * 0.08,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <GroundStrip colors={["#4a8c3f", "#3a7230", "#4a8c3f"]} h={12} />
      <GroundStrip colors={["#6b4226", "#8B5E3C", "#6b4226"]} h={9} />
    </div>
  );
}
