import { createContext, useContext, useState } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // ── LOGIN ─────────────────────────────────────────────
  // Frontend utilise { courriel, mot_de_passe }
  // Backend attend  { email,    password        }
  const login = async ({ courriel, mot_de_passe }) => {
    setLoading(true);
    try {
      const res = await apiLogin({
        email:    courriel,
        password: mot_de_passe,
      });
      // Backend retourne { token, user: { id, nom, email, role } }
      const { token, user: utilisateur } = res.data;
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

  // ── REGISTER ──────────────────────────────────────────
  // Frontend utilise { prenom, nom, courriel, mot_de_passe }
  // Backend attend  { nom,              email,    password  }
  const register = async ({ prenom, nom, courriel, mot_de_passe }) => {
    setLoading(true);
    try {
      await apiRegister({
        nom:      `${prenom} ${nom}`.trim(), // backend a 1 seul champ "nom"
        email:    courriel,
        password: mot_de_passe,
      });
      // Backend register retourne juste { message, userId } — pas de token
      // On fait un login automatique après l'inscription
      return await login({ courriel, mot_de_passe });
    } catch (err) {
      const msg = err.response?.data?.message || "Erreur lors de l'inscription.";
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── LOGOUT ────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role === 'administrateur'; // backend utilise 'administrateur'

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}