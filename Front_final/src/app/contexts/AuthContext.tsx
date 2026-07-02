import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/edugest';

const API_URL = 'http://localhost:8080/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('edugest_token');
    const savedUser = localStorage.getItem('edugest_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!res.ok || !data.token) {
      throw new Error(data.message || 'Échec de connexion');
    }

    const connectedUser: User = {
      idPers: data.user.idPers,
      username,
      role: data.user.role,
      typePersonne: data.user.typePersonne || 1,
      nom: data.user.nom,
      prenom: data.user.prenom || '',
    };

    setUser(connectedUser);
    setToken(data.token);
    localStorage.setItem('edugest_token', data.token);
    localStorage.setItem('edugest_user', JSON.stringify(connectedUser));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('edugest_token');
    localStorage.removeItem('edugest_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
