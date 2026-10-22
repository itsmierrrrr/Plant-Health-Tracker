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
    <header className="sticky top-0 z-50 border-b border-[#dfe5d9] bg-[#f8f3e8]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#347c70] text-[#fffdf7] shadow-lg shadow-[#347c70]/20">
              <Sprout className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#708079]">AI plant health tracker</p>
              <p className="font-display text-lg font-semibold text-[#20312f]">Plant Pulse</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 rounded-full border border-[#dfe5d9] bg-[#fffdf7] p-1.5 shadow-sm lg:flex">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#eef1eb] hover:text-[#20312f]',
                    isActive ? 'bg-[#347c70] text-white shadow-sm' : 'text-[#526460]'
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
                <div className="flex items-center gap-3 rounded-full border border-[#dfe5d9] bg-[#f5f1e7] px-4 py-2 text-sm text-[#526460]">
                  <UserCircle2 className="h-4 w-4 text-[#347c70]" />
                  <span>{user?.name || user?.email || 'Account'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="meadow-button inline-flex items-center gap-2 rounded-full bg-[#d97761] px-4 py-2 text-sm font-semibold text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-[#dfe5d9] bg-[#f5f1e7] p-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#eef1eb] hover:text-[#20312f]',
                      isActive ? 'bg-cream text-[#173a36] shadow-sm' : 'text-[#526460]'
                    )
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#eef1eb] hover:text-[#20312f]',
                      isActive ? 'bg-cream text-[#173a36] shadow-sm' : 'text-[#526460]'
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
            className="inline-flex items-center justify-center rounded-2xl border border-[#dfe5d9] bg-[#fffdf7] p-3 text-[#20312f] transition hover:bg-[#f5f1e7] lg:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn('border-t border-[#dfe5d9] bg-[#fffdf7] px-4 pb-4 lg:hidden', isOpen ? 'block' : 'hidden')}>
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
                      isActive ? 'border-[#347c70] bg-[#347c70] text-white' : 'border-[#dfe5d9] bg-[#f5f1e7] text-[#526460] hover:bg-[#eef8f5]'
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
                  <div className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] px-4 py-3 text-sm text-[#526460]">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-4 w-4 text-[#347c70]" />
                      <span>{user?.name || user?.email || 'Account'}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      void handleLogout();
                    }}
                    className="meadow-button-secondary inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium"
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
                    className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] px-4 py-3 text-sm font-medium text-[#526460] transition hover:bg-[#eef8f5]"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl border border-[#dfe5d9] bg-[#f5f1e7] px-4 py-3 text-sm font-medium text-[#526460] transition hover:bg-[#eef8f5]"
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