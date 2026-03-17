import {
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  login as loginRequest,
  register as registerRequest,
} from '../services/authService';
import type { AuthUser, LoginRequest, RegisterRequest } from '../types/auth';
import { AuthContext } from './useAuth';

function getStoredToken() {
  const token = localStorage.getItem('token');
  return token && token !== 'undefined' && token !== 'null' ? token : null;
}

function getStoredUser(): AuthUser | null {
  const storedUser = localStorage.getItem('authUser');

  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);

  async function login(data: LoginRequest) {
    const response = await loginRequest(data);

    const nextUser: AuthUser = {
      email: response.email,
      role: response.role,
    };

    localStorage.setItem('token', response.token);
    localStorage.setItem('authUser', JSON.stringify(nextUser));

    setToken(response.token);
    setUser(nextUser);
  }

  async function register(data: RegisterRequest) {
    const response = await registerRequest(data);

    const nextUser: AuthUser = {
      email: response.email,
      role: response.role,
    };

    localStorage.setItem('token', response.token);
    localStorage.setItem('authUser', JSON.stringify(nextUser));

    setToken(response.token);
    setUser(nextUser);
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


