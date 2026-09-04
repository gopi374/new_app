import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { heritageService } from '../services/heritageService';

interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (full_name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const result = await heritageService.login(email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setToken(result.token || null);
      heritageService.setToken(result.token || null);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const register = useCallback(async (full_name: string, email: string, password: string) => {
    const result = await heritageService.register(full_name, email, password);
    if (result.success && result.user) {
      setUser(result.user);
      setToken(result.token || null);
      heritageService.setToken(result.token || null);
      return { success: true };
    }
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    heritageService.setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
