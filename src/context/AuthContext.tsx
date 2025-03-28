import React, { createContext, useContext, useState } from 'react';
import { AuthState } from '../types/auth';

interface AuthContextType {
  auth: AuthState;
  login: (token: string, userData: AuthState['user']) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { token: null, user: null };
  });

  const login = (token: string, userData: AuthState['user']) => {
    const newAuth = { token, user: userData };
    setAuth(newAuth);
    localStorage.setItem('auth', JSON.stringify(newAuth));
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('auth');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};