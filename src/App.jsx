import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import './styles/globals.css';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import AuthLayout from './components/layout/AuthLayout';
import AppLayout from './components/layout/AppLayout';

// ── Route Guards ──────────────────────────────────────────────────────────────

// Blocks unauthenticated users from app pages → sends them to /login
function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();

  // Clerk is still initializing — render nothing to avoid flash
  if (!isLoaded) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--stone)', flexDirection: 'column', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40,
        border: '4px solid var(--border-green)',
        borderTopColor: 'var(--green-bright)',
        animation: 'spin 0.8s linear infinite',
      }} />
      <span style={{ fontFamily: 'var(--font-pixel)', fontSize: 8, color: 'var(--text-secondary)', letterSpacing: 2 }}>
        LOADING<span style={{ animation: 'blink 1s step-end infinite' }}>█</span>
      </span>
    </div>
  );

  if (!isSignedIn) return <Navigate to="/login" replace />;
  return children;
}

// Blocks already-authenticated users from auth pages → sends them to /dashboard
function RedirectIfAuthed({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;
  if (isSignedIn) return <Navigate to="/dashboard" replace />;
  return children;
}

// Public Pages
import Home from './pages/public/Home';
import Features from './pages/public/Features';
import UseCases from './pages/public/UseCases';
import Pricing from './pages/public/Pricing';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// User Pages
import Dashboard from './pages/user/Dashboard';
import Analyze from './pages/user/Analyze';

// Repo Pages
import RepoOverview from './pages/repo/RepoOverview';
import RepoStructure from './pages/repo/RepoStructure';
import RepoGraph from './pages/repo/RepoGraph';
import FunctionDetail from './pages/repo/FunctionDetail';
import RepoAnalytics from './pages/repo/RepoAnalytics';
import RepoAsk from './pages/repo/RepoAsk';
import RepoHistory from './pages/repo/RepoHistory';

// Account Pages
import Profile from './pages/account/Profile';
import Settings from './pages/account/Settings';

// Legal Pages
import Privacy from './pages/legal/Privacy';
import Terms from './pages/legal/Terms';
import Security from './pages/legal/Security';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Public Routes ── */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/use-cases" element={<UseCases />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
        </Route>

        {/* ── Auth Routes — redirect to dashboard if already signed in ── */}
        <Route element={<RedirectIfAuthed><AuthLayout /></RedirectIfAuthed>}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        {/* ── App Routes — must be signed in ── */}
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Repo sub-routes */}
          <Route path="/:repoId" element={<RepoOverview />} />
          <Route path="/:repoId/structure" element={<RepoStructure />} />
          <Route path="/:repoId/graph" element={<RepoGraph />} />
          <Route path="/:repoId/function/:functionId" element={<FunctionDetail />} />
          <Route path="/:repoId/analytics" element={<RepoAnalytics />} />
          <Route path="/:repoId/ask" element={<RepoAsk />} />
          <Route path="/:repoId/history" element={<RepoHistory />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}