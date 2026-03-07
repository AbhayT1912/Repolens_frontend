// ─── Legal Pages ─────────────────────────────────────────────────────────────
import { Link } from 'react-router-dom';

function LegalLayout({ title, lastUpdated, children }) {
  return (
    <div>
      <section style={{ padding: '60px 80px 40px', background: 'var(--sky-top)', borderBottom: '3px solid var(--border-green)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
          <Link to="/" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>← Home</Link>
        </div>
        <h1 style={{ fontFamily: 'var(--font-pixel)', fontSize: 18, color: 'var(--green-bright)', textShadow: '3px 3px 0 #052e16', marginBottom: 10, lineHeight: 1.6 }}>
          {title}
        </h1>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
          Last updated: {lastUpdated}
        </div>
      </section>
      <section style={{ padding: '60px 80px', maxWidth: 860, margin: '0 auto', fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.9 }}>
        {children}
      </section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: 10, color: 'var(--green-bright)', textShadow: '2px 2px 0 #052e16', marginBottom: 14, lineHeight: 1.6 }}>
        {title}
      </h2>
      <div style={{ color: 'var(--text-secondary)' }}>{children}</div>
    </div>
  );
}

// ─── Privacy ──────────────────────────────────────────────────────────────────
export function Privacy() {
  return (
    <LegalLayout title="PRIVACY POLICY" lastUpdated="February 19, 2026">
      <Section title="1. WHAT WE COLLECT">
        <p style={{ marginBottom: 12 }}>We collect information you provide directly to us, including account registration data (email, name), repository URLs you submit for analysis, and questions you ask through the AI Q&A feature.</p>
        <p>We also collect usage data such as pages visited, features used, and performance metrics through anonymous analytics.</p>
      </Section>
      <Section title="2. HOW WE USE YOUR DATA">
        <p style={{ marginBottom: 12 }}>Your data is used to provide, improve, and personalize the RepoLink service. Repository content submitted for analysis is processed in real-time and is not stored beyond your analysis history.</p>
        <p>We do not sell your data to third parties, and we do not use your code to train AI models.</p>
      </Section>
      <Section title="3. DATA STORAGE & RETENTION">
        <p>Analysis results are stored in encrypted form and associated with your account. You may delete your history at any time from Settings. Account data is retained for 30 days after account deletion for legal compliance purposes.</p>
      </Section>
      <Section title="4. COOKIES">
        <p>We use essential cookies for authentication and session management. We use analytics cookies (opt-out available) to improve the product. No advertising cookies are used.</p>
      </Section>
      <Section title="5. YOUR RIGHTS">
        <p>You have the right to access, export, correct, or delete your personal data at any time. Contact us at privacy@RepoLink.dev to exercise these rights.</p>
      </Section>
      <Section title="6. CONTACT">
        <p>For privacy concerns: <span style={{ color: 'var(--green-bright)' }}>privacy@RepoLink.dev</span></p>
      </Section>
    </LegalLayout>
  );
}

// ─── Terms ────────────────────────────────────────────────────────────────────
export function Terms() {
  return (
    <LegalLayout title="TERMS OF SERVICE" lastUpdated="February 19, 2026">
      <Section title="1. ACCEPTANCE OF TERMS">
        <p>By accessing or using RepoLink, you agree to be bound by these Terms of Service. If you do not agree, please do not use the service.</p>
      </Section>
      <Section title="2. USE OF SERVICE">
        <p style={{ marginBottom: 12 }}>You may use RepoLink for lawful purposes only. You agree not to submit code repositories that you do not have permission to analyze, attempt to circumvent rate limits or access controls, use the service to reverse-engineer our AI systems, or resell or redistribute RepoLink outputs without attribution.</p>
      </Section>
      <Section title="3. INTELLECTUAL PROPERTY">
        <p>RepoLink does not claim ownership of any code you submit. Your code remains yours. The analysis outputs (call graphs, AI explanations, metrics) are licensed to you for use under your subscription plan.</p>
      </Section>
      <Section title="4. SUBSCRIPTION & PAYMENT">
        <p>Paid plans are billed monthly. You may cancel at any time; cancellation takes effect at the end of the current billing period. Refunds are not issued for partial months, except where required by law.</p>
      </Section>
      <Section title="5. LIMITATION OF LIABILITY">
        <p>RepoLink is provided "as is." We do not warrant that the service will be error-free. Our liability is limited to the amount paid in the preceding 3 months.</p>
      </Section>
      <Section title="6. CHANGES TO TERMS">
        <p>We may update these terms. Material changes will be communicated via email with 30 days notice.</p>
      </Section>
    </LegalLayout>
  );
}

// ─── Security ────────────────────────────────────────────────────────────────
export function Security() {
  const MEASURES = [
    { icon: '🔒', title: 'Encryption at Rest', desc: 'All data is encrypted using AES-256. Your analysis history and credentials are never stored in plaintext.' },
    { icon: '🛡', title: 'TLS in Transit', desc: 'All communications between your browser and RepoLink servers use TLS 1.3.' },
    { icon: '🏗', title: 'Infrastructure', desc: 'Hosted on AWS in SOC 2 compliant data centers. We use separate environments for development and production.' },
    { icon: '🔑', title: 'Token Security', desc: 'GitHub tokens are encrypted with a per-user key. We never log or expose raw tokens in any API response.' },
    { icon: '👮', title: 'Access Controls', desc: 'Principle of least privilege applies to all internal access. Production database access requires multi-factor authentication.' },
    { icon: '🚨', title: 'Vulnerability Disclosure', desc: 'Found a bug? Report it responsibly to security@RepoLink.dev. We respond within 48 hours and offer a bounty program.' },
  ];

  return (
    <LegalLayout title="SECURITY" lastUpdated="February 19, 2026">
      <p style={{ marginBottom: 40, fontSize: 15, color: 'var(--text-secondary)' }}>
        Security is not an afterthought at RepoLink — it's foundational. Here's how we protect your code and data.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 40 }}>
        {MEASURES.map(({ icon, title, desc }) => (
          <div key={title} style={{
            background: 'var(--stone-mid)',
            border: '2px solid var(--border-green)',
            padding: '20px 20px',
            boxShadow: 'var(--pixel-shadow)',
          }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--green-bright)', marginBottom: 10, lineHeight: 1.6 }}>{title}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{desc}</div>
          </div>
        ))}
      </div>

      <Section title="RESPONSIBLE DISCLOSURE">
        <p style={{ marginBottom: 12 }}>We take security reports seriously. Please send any vulnerability findings to <span style={{ color: 'var(--green-bright)' }}>security@RepoLink.dev</span>.</p>
        <p>Include a description of the vulnerability, steps to reproduce, and potential impact. Do not publicly disclose until we've had 90 days to patch and we'll give you full credit.</p>
      </Section>
    </LegalLayout>
  );
}
