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
    <header className="sticky top-0 z-50 border-b border-[#D8E3C9] bg-[#FFFDF8]/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#476B49] text-[#FFFDF8] shadow-lg shadow-[#476B49]/20">
              <Sprout className="h-6 w-6" />
            </span>
            <div className="leading-tight">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-[#476B49]">AI plant health tracker</p>
              <p className="font-display text-lg font-semibold text-[#1F3B2E]">Plant Pulse</p>
            </div>
          </NavLink>

          <nav className="hidden items-center gap-1 rounded-full border border-[#D8E3C9] bg-[#FFFDF8] p-1.5 shadow-sm lg:flex">
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#D8E3C9] hover:text-[#1F3B2E]',
                    isActive ? 'bg-[#476B49] text-white shadow-sm' : 'text-[#1F3B2E]'
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
                <div className="flex items-center gap-3 rounded-full border border-[#D8E3C9] bg-[#D8E3C9] px-4 py-2 text-sm text-[#1F3B2E]">
                  <UserCircle2 className="h-4 w-4 text-[#476B49]" />
                  <span>{user?.name || user?.email || 'Account'}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="meadow-button inline-flex items-center gap-2 rounded-full bg-[#86A943] px-4 py-2 text-sm font-semibold text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2 rounded-full border border-[#D8E3C9] bg-[#D8E3C9] p-2">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#D8E3C9] hover:text-[#1F3B2E]',
                      isActive ? 'bg-cream text-[#1F3B2E] shadow-sm' : 'text-[#1F3B2E]'
                    )
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className={({ isActive }) =>
                    cn(
                      'rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-[#D8E3C9] hover:text-[#1F3B2E]',
                      isActive ? 'bg-cream text-[#1F3B2E] shadow-sm' : 'text-[#1F3B2E]'
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
            className="inline-flex items-center justify-center rounded-2xl border border-[#D8E3C9] bg-[#FFFDF8] p-3 text-[#1F3B2E] transition hover:bg-[#D8E3C9] lg:hidden"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div className={cn('border-t border-[#D8E3C9] bg-[#FFFDF8] px-4 pb-4 lg:hidden', isOpen ? 'block' : 'hidden')}>
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
                      isActive ? 'border-[#476B49] bg-[#476B49] text-white' : 'border-[#D8E3C9] bg-[#D8E3C9] text-[#1F3B2E] hover:bg-[#E8F0D8]'
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
                  <div className="rounded-2xl border border-[#D8E3C9] bg-[#D8E3C9] px-4 py-3 text-sm text-[#1F3B2E]">
                    <div className="flex items-center gap-2">
                      <UserCircle2 className="h-4 w-4 text-[#476B49]" />
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
                    className="rounded-2xl border border-[#D8E3C9] bg-[#D8E3C9] px-4 py-3 text-sm font-medium text-[#1F3B2E] transition hover:bg-[#E8F0D8]"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl border border-[#D8E3C9] bg-[#D8E3C9] px-4 py-3 text-sm font-medium text-[#1F3B2E] transition hover:bg-[#E8F0D8]"
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