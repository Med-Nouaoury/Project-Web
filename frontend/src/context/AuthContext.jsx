import { createContext, useContext, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await apiLogin(credentials);
      const { token, utilisateur } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(utilisateur));
      setUser(utilisateur);
      return utilisateur;
    } catch (err) {
      const msg = err.response?.data?.message || 'Identifiants incorrects.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      const res = await apiRegister(data);
      const { token, utilisateur } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(utilisateur));
      setUser(utilisateur);
      return utilisateur;
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'inscription.';
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
