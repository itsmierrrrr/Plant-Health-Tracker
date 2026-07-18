import { PageContainer } from '../components/PageContainer';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../utils/cn';
import { ArrowRight, Leaf, LogIn, Shield, Sparkles } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { requestGoogleAccessToken } from '../services/googleIdentity';

function getErrorMessage(error: unknown) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = error.response as { data?: { message?: string; details?: string[] } };
    return response.data?.details?.[0] || response.data?.message || 'Unable to sign in.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unable to sign in.';
}

export function LoginPage() {
  const { login, loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = await login({ email, password });
      const fallbackRedirect = session.user.isAdmin ? '/admin' : '/dashboard';
      navigate(redirectTo === '/dashboard' ? fallbackRedirect : redirectTo, { replace: true });
    } catch (authError) {
      setError(getErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (!googleClientId) {
      setError('Google sign-in is not configured yet.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const accessToken = await requestGoogleAccessToken(googleClientId);
      const session = await loginWithGoogle({ accessToken });
      const fallbackRedirect = session.user.isAdmin ? '/admin' : '/dashboard';
      navigate(redirectTo === '/dashboard' ? fallbackRedirect : redirectTo, { replace: true });
    } catch (authError) {
      setError(getErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated && !isLoading) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <PageContainer className="grid min-h-[calc(100vh-8rem)] items-center py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-leaf-300/20 bg-leaf-400/10 px-4 py-2 text-sm font-medium text-leaf-100">
          <LogIn className="h-4 w-4" />
          Secure access
        </div>
        <h1 className="max-w-2xl font-display text-4xl font-semibold leading-tight text-cream sm:text-5xl">
          Sign in to your personal plant analytics workspace.
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-300">
          Each account gets isolated analyses, private dashboard statistics, and a protected history archive.
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { title: 'JWT', copy: 'Stateless bearer auth for the API.', icon: Shield },
            { title: 'Private data', copy: 'Analyses are scoped to your user id.', icon: Leaf },
            { title: 'Live dashboard', copy: 'Charts and history update from your data.', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf-400/15 text-leaf-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-cream">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{item.copy}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-soft sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-leaf-200">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold text-cream">Log in</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Use your account email and password to continue.</p>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={cn(
                'flex w-full items-center justify-center gap-3 rounded-full border border-white/15 bg-cream px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60',
                loading && 'translate-y-0',
                !googleClientId && 'opacity-80'
              )}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.654 32.657 29.257 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.055 0 5.827 1.155 7.938 3.047l5.657-5.657C34.001 6.053 29.348 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.651-.389-3.917z" />
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.055 0 5.827 1.155 7.938 3.047l5.657-5.657C34.001 6.053 29.348 4 24 4c-7.682 0-14.354 4.338-17.694 10.691z" />
                  <path fill="#4CAF50" d="M24 44c5.23 0 9.81-1.997 13.34-5.26l-6.16-5.206C29.29 35.091 26.818 36 24 36c-5.236 0-9.618-3.317-11.292-7.946l-6.52 5.025C9.476 39.556 16.227 44 24 44z" />
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.288 3.65-4.104 6.446-7.123 7.534l.002-.001 6.16 5.206C34.901 39.263 40 34 40 24c0-1.341-.138-2.651-.389-3.917z" />
                </svg>
              </span>
              {loading ? 'Signing in...' : 'Continue with Google'}
            </button>
            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-slate-500">
              <span className="h-px flex-1 bg-white/10" />
              or use email
              <span className="h-px flex-1 bg-white/10" />
            </div>
          </div>

          {!googleClientId ? (
            <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-400">
              Add VITE_GOOGLE_CLIENT_ID to enable Google sign-in.
            </p>
          ) : null}

          <label className="block space-y-2 text-sm text-slate-300">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition placeholder:text-slate-500 focus:border-leaf-400/40"
              placeholder="you@example.com"
            />
          </label>

          <label className="block space-y-2 text-sm text-slate-300">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none transition placeholder:text-slate-500 focus:border-leaf-400/40"
              placeholder="Enter your password"
            />
          </label>

          {error ? <p className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className={cn(
              'inline-flex w-full items-center justify-center gap-2 rounded-full bg-cream px-6 py-3.5 text-sm font-semibold text-brand-900 transition hover:-translate-y-0.5 hover:shadow-lift disabled:cursor-not-allowed disabled:opacity-60',
              loading && 'translate-y-0'
            )}
          >
            {loading ? 'Signing in...' : 'Sign in'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <p className="text-center text-sm text-slate-400">
            No account yet?{' '}
            <Link to="/register" className="font-semibold text-leaf-200 transition hover:text-leaf-100">
              Create one
            </Link>
          </p>
        </form>
      </div>
    </PageContainer>
  );
}
