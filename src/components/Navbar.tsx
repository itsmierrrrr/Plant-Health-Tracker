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

  const navigationItems = isAuthenticated ? privateNavigationItems : publicNavigationItems;

  async function handleLogout() {
    await logout();
    navigate('/', { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07101b]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-leaf-400 to-brand-400 text-brand-900 shadow-lg shadow-leaf-500/20">
            <Sprout className="h-6 w-6" />
          </span>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">AI Plant Health Tracker</p>
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
                  'rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-cream',
                  isActive ? 'bg-cream text-brand-900' : 'text-slate-300'
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
            <div className="flex items-center gap-2">
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  cn('rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-cream', isActive ? 'bg-cream text-brand-900' : 'text-slate-300')
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  cn('rounded-full px-4 py-2 text-sm font-medium transition hover:bg-white/10 hover:text-cream', isActive ? 'bg-cream text-brand-900' : 'text-slate-300')
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

      <div className={cn('border-t border-white/10 bg-slate-950/95 px-4 pb-4 lg:hidden', isOpen ? 'block' : 'hidden')}>
        <nav className="mx-auto max-w-7xl pt-4">
          <div className="grid gap-2 sm:grid-cols-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'rounded-2xl border border-white/10 px-4 py-3 text-sm font-medium transition',
                    isActive ? 'bg-cream text-brand-900' : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  void handleLogout();
                }}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
              >
                Logout
              </button>
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
        </nav>
      </div>
    </header>
  );
}