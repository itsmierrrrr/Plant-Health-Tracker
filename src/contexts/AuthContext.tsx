import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { fetchCurrentUser, loginUser, loginWithGoogle as loginWithGoogleUser, logoutUser, registerUser } from '../services/authApi';
import { clearAuthToken, getAuthToken, setAuthToken } from '../services/authStorage';
import type { AuthCredentials, AuthSession, AuthUser, GoogleAuthCredentials, RegisterCredentials } from '../types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<AuthSession>;
  loginWithGoogle: (credentials: GoogleAuthCredentials) => Promise<AuthSession>;
  register: (credentials: RegisterCredentials) => Promise<AuthSession>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(() => getAuthToken());
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(token));

  useEffect(() => {
    let active = true;

    async function bootstrapAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!active) {
          return;
        }

        setUser(currentUser);
      } catch {
        if (!active) {
          return;
        }

        clearAuthToken();
        setToken(null);
        setUser(null);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    bootstrapAuth();

    return () => {
      active = false;
    };
  }, []);

  async function persistSession(session: AuthSession) {
    setAuthToken(session.token);
    setToken(session.token);
    setUser(session.user);
    return session;
  }

  async function login(credentials: AuthCredentials) {
    const session = await loginUser(credentials);
    return persistSession(session);
  }

  async function loginWithGoogle(credentials: GoogleAuthCredentials) {
    const session = await loginWithGoogleUser(credentials);
    return persistSession(session);
  }

  async function register(credentials: RegisterCredentials) {
    const session = await registerUser(credentials);
    return persistSession(session);
  }

  async function logout() {
    try {
      await logoutUser();
    } catch {
      // Clear local auth state even if the server rejects the logout request.
    } finally {
      clearAuthToken();
      setToken(null);
      setUser(null);
    }
  }

  const value: AuthContextValue = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    loginWithGoogle,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
