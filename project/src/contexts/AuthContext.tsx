import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role?: 'admin' | 'client') => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  role: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('role');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
    if (savedRole) {
      setRole(savedRole);
    }
    // Optionally validate token with /auth/me (do NOT clear token on failure to avoid logging user out during page load)
    if (token) {
      fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` }})
        .then(async (res) => {
          if (!res.ok) return;
          const data = await res.json();
          if (data && data.role) {
            setRole(data.role);
            localStorage.setItem('role', data.role);
          }
        })
        .catch(() => {
          // Silently ignore validation errors to prevent clearing a potentially valid token
        });
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) return false;
      const data = await res.json();
      const appUser: User = { id: data.user_id, name: data.nom, email: data.email };
      setUser(appUser);
      localStorage.setItem('user', JSON.stringify(appUser));
      localStorage.setItem('token', data.access_token);
      if (data.role) {
        setRole(data.role);
        localStorage.setItem('role', data.role);
      }
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, role: 'admin' | 'client' = 'client'): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: name, email, password, role })
      });
      if (!res.ok) return false;
      const data = await res.json();
      const appUser: User = { id: data.user_id, name: data.nom, email: data.email };
      setUser(appUser);
      localStorage.setItem('user', JSON.stringify(appUser));
      localStorage.setItem('token', data.access_token);
      if (data.role) {
        setRole(data.role);
        localStorage.setItem('role', data.role);
      }
      return true;
    } catch (e) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        role,
        isAdmin: role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};