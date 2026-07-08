import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../types/edugest';

const API_URL = 'http://localhost:8080/api';

const DEMO_ACCOUNTS: Record<string, { nom: string; prenom: string; role: User['role'] }> = {
  admin: { nom: 'Admin', prenom: 'Système', role: 'ADMIN' },
  directeur: { nom: 'Nkwi', prenom: 'Paul', role: 'DIRECTEUR' },
  enseignant: { nom: 'Tchinda', prenom: 'Marie', role: 'ENSEIGNANT' },
  responsable_admin: { nom: 'Mbah', prenom: 'Alice', role: 'RESPONSABLE_ADMIN' },
  parent: { nom: 'Fotso', prenom: 'Jean', role: 'PARENT' },
};

const DEMO_PASSWORD = 'password123';

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
    const trimmedUser = username.trim().toLowerCase();

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUser, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        const connectedUser: User = {
          idPers: data.user.idPers,
          username: trimmedUser,
          role: data.user.role,
          typePersonne: data.user.typePersonne || 1,
          nom: data.user.nom?.trim() || '',
          prenom: data.user.prenom?.trim() || '',
        };

        setUser(connectedUser);
        setToken(data.token);
        localStorage.setItem('edugest_token', data.token);
        localStorage.setItem('edugest_user', JSON.stringify(connectedUser));
        return;
      }
      throw new Error(data.message || 'Identifiants incorrects');
    } catch (err: any) {
      // Fallback demo si backend indisponible ou utilisateur inconnu
      if (password === DEMO_PASSWORD && DEMO_ACCOUNTS[trimmedUser]) {
        const demo = DEMO_ACCOUNTS[trimmedUser];
        const fakeToken = btoa(`${trimmedUser}:${Date.now()}`);
        const connectedUser: User = {
          idPers: Object.keys(DEMO_ACCOUNTS).indexOf(trimmedUser) + 1,
          username: trimmedUser,
          role: demo.role,
          typePersonne: 1,
          nom: demo.nom,
          prenom: demo.prenom,
        };
        setUser(connectedUser);
        setToken(fakeToken);
        localStorage.setItem('edugest_token', fakeToken);
        localStorage.setItem('edugest_user', JSON.stringify(connectedUser));
        return;
      }
      throw new Error(err.message || 'Échec de connexion');
    }
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
