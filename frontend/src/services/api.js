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

// ── Auth ──────────────────────────────────────────────────
// Backend attend : { nom, email, password }
export const login    = (credentials) => api.post('/auth/login', credentials);
export const register = (data)        => api.post('/auth/register', data);

// ── Utilisateurs ──────────────────────────────────────────
// GET /users/me  (pas /auth/me)
export const getMe             = ()           => api.get('/users/me');
// GET /users     (pas /utilisateurs)
export const getUtilisateurs   = ()           => api.get('/users');
export const updateUtilisateur = (id, data)   => api.put(`/users/${id}`, data);
export const toggleActifUser   = (id, actif)  => api.put(`/users/${id}/actif`, { actif });

// ── Ouvrages ──────────────────────────────────────────────
// Backend supporte ?q= ?categorie_id= ?sort=popularite|prix_asc|prix_desc
export const getOuvrages   = (params = {}) => api.get('/ouvrages', { params });
export const getOuvrage    = (id)          => api.get(`/ouvrages/${id}`);
export const createOuvrage = (data)        => api.post('/ouvrages', data);
export const updateOuvrage = (id, data)    => api.put(`/ouvrages/${id}`, data);
export const deleteOuvrage = (id)          => api.delete(`/ouvrages/${id}`);

// ── Avis ──────────────────────────────────────────────────
// Pas de GET /ouvrages/:id/avis séparé — les avis sont dans getOuvrage().data.avis
export const getAvis  = (ouvrageId) =>
  api.get(`/ouvrages/${ouvrageId}`).then((r) => ({ data: r.data.avis || [] }));
// POST /ouvrages/:id/avis — nécessite achat confirmé (statut payee ou expediee)
export const postAvis = (ouvrageId, data) =>
  api.post(`/ouvrages/${ouvrageId}/avis`, data);

// ── Commentaires ouvrages ─────────────────────────────────
export const postCommentaire = (ouvrageId, contenu) =>
  api.post(`/ouvrages/${ouvrageId}/commentaires`, { contenu });

// ── Catégories ────────────────────────────────────────────
export const getCategories    = ()           => api.get('/categories');
export const getCategorie     = (id)         => api.get(`/categories/${id}`);
export const createCategorie  = (data)       => api.post('/categories', data);
export const updateCategorie  = (id, data)   => api.put(`/categories/${id}`, data);
export const deleteCategorie  = (id)         => api.delete(`/categories/${id}`);

// ── Panier ────────────────────────────────────────────────
export const getPanier      = ()                    => api.get('/panier');
export const addPanierItem  = (ouvrage_id, quantite = 1) =>
  api.post('/panier/items', { ouvrage_id, quantite });
export const updatePanierItem = (itemId, quantite)  =>
  api.put(`/panier/items/${itemId}`, { quantite });
export const removePanierItem = (itemId)            =>
  api.delete(`/panier/items/${itemId}`);

// ── Commandes ─────────────────────────────────────────────
export const getCommandes  = ()     => api.get('/commandes');
export const getCommande   = (id)   => api.get(`/commandes/${id}`);
// Backend attend : { adresse_livraison, mode_livraison?, mode_paiement? }
export const createCommande = (data) => api.post('/commandes', data);
// PUT /commandes/:id/status  (pas PATCH, pas /statut)
// Body attend : { statut } parmi en_cours|payee|annulee|expediee
export const updateCommandeStatus = (id, statut) =>
  api.put(`/commandes/${id}/status`, { statut });

// ── Listes de cadeaux ─────────────────────────────────────
export const createListe   = (nom)                        => api.post('/listes', { nom });
export const getListeByCode = (code)                      => api.get(`/listes/${code}`);
export const addListeItem  = (listeId, ouvrage_id, qty)   =>
  api.post(`/listes/${listeId}/items`, { ouvrage_id, quantite_souhaitee: qty });
export const acheterDepuisListe = (listeId, data)         =>
  api.post(`/listes/${listeId}/acheter`, data);

// ── Commentaires admin (modération) ──────────────────────
export const getCommentairesPending = ()           => api.get('/commentaires');
export const validerCommentaire     = (id, valide) =>
  api.put(`/commentaires/${id}/valider`, { valide });

export const uploadImageOuvrage = (id, file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post(`/ouvrages/${id}/image`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;