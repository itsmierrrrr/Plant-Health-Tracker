import { cn } from '../utils/cn';
import { useAuth } from '../contexts/AuthContext';
import { Menu, LogOut, Sprout, UserCircle2, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const publicNavigationItems = [{ label: 'Home', to: '/' }];

const privateNavigationItems = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Upload', to: '/upload' },
  { label: 'Results', to: '/results' },
  { label: 'History', to: '/history' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const navigationItems = isAuthenticated
    ? [...privateNavigationItems, ...(user?.isAdmin ? [{ label: 'Admin', to: '/admin' }] : [])]
    : publicNavigationItems;

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101b]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-400 to-brand-400 text-brand-900 shadow-lg shadow-leaf-500/20">
              <Sprout className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-slate-400">AI Plant Health Tracker</p>
              <p className="font-display text-lg font-semibold text-cream">Verdant Lens</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 lg:flex">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/10 hover:text-cream',
                    isActive ? 'bg-cream text-brand-900 shadow-sm' : 'text-slate-300'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
                  <UserCircle2 className="h-4 w-4 text-leaf-200" />
                  <span>{user?.name || user?.email || 'Account'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full bg-cream px-4 py-2 text-sm font-semibold text-brand-900 transition hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/10 hover:text-cream',
                      isActive ? 'bg-cream text-brand-900 shadow-sm' : 'text-slate-300'
                    )
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-white/10 hover:text-cream',
                      isActive ? 'bg-cream text-brand-900 shadow-sm' : 'text-slate-300'
                    )
                  }
                >
                  Register
                </NavLink>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 text-cream transition hover:bg-white/10 lg:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn('border-t border-white/10 bg-slate-950/95 px-4 pb-4 lg:hidden', isOpen ? 'block' : 'hidden')}>
        <div className="mx-auto max-w-7xl pt-4">
          <div className="space-y-3">
            <div className="grid gap-2 sm:grid-cols-2">
              {navigationItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-2xl border px-4 py-3 text-sm font-medium transition-colors duration-200',
                      isActive ? 'border-cream bg-cream text-brand-900' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {isAuthenticated ? (
                <>
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-4 w-4 text-leaf-200" />
                      <span>{user?.name || user?.email || 'Account'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      void handleLogout();
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}