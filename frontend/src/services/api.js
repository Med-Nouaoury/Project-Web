import axios from 'axios';

const API_BASE = import.meta?.env?.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ── Ouvrages ──────────────────────────────────────────────
export const getOuvrages = (params = {}) => api.get('/ouvrages', { params });
export const getOuvrage = (id) => api.get(`/ouvrages/${id}`);
export const createOuvrage = (data) => api.post('/ouvrages', data);
export const updateOuvrage = (id, data) => api.put(`/ouvrages/${id}`, data);
export const deleteOuvrage = (id) => api.delete(`/ouvrages/${id}`);

// ── Catégories ────────────────────────────────────────────
export const getCategories = () => api.get('/categories');

// ── Avis ──────────────────────────────────────────────────
export const getAvis = (ouvrageId) => api.get(`/ouvrages/${ouvrageId}/avis`);
export const postAvis = (ouvrageId, data) => api.post(`/ouvrages/${ouvrageId}/avis`, data);

// ── Commandes ─────────────────────────────────────────────
export const getCommandes = () => api.get('/commandes');
export const getCommande = (id) => api.get(`/commandes/${id}`);
export const createCommande = (data) => api.post('/commandes', data);
export const updateCommandeStatus = (id, statut) => api.patch(`/commandes/${id}/statut`, { statut });

// ── Auth ──────────────────────────────────────────────────
export const login = (credentials) => api.post('/auth/login', credentials);
export const register = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

// ── Utilisateurs (admin) ──────────────────────────────────
export const getUtilisateurs = () => api.get('/utilisateurs');
export const deleteUtilisateur = (id) => api.delete(`/utilisateurs/${id}`);

export default api;
