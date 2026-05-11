# 📚 LivresGourmands — Front-end React

Site e-commerce de livres culinaires développé avec **React 18 + Vite + Bootstrap 5**.

---

## 🚀 Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer en développement
npm run dev
# → http://localhost:5173

# 3. Build de production
npm run build
```

> **Variable d'environnement :** créez un fichier `.env` à la racine :
> ```
> VITE_API_URL=http://localhost:3000/api
> ```

---

## 🗂️ Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation sticky avec recherche + panier
│   ├── Footer.jsx          # Pied de page avec infolettre
│   ├── BookCard.jsx        # Carte livre réutilisable (ajout panier intégré)
│   ├── Toast.jsx           # Système de notifications (hook + composant)
│   └── ProtectedRoute.jsx  # Guard de routes (auth + admin)
│
├── context/
│   ├── CartContext.jsx     # Panier global (Context API + localStorage)
│   └── AuthContext.jsx     # Authentification JWT (login, logout, user)
│
├── pages/
│   ├── HomePage.jsx        # Accueil : carrousel, filtres, catalogue
│   ├── ProductPage.jsx     # Fiche produit : détails, avis, ajout panier
│   ├── CartPage.jsx        # Panier : gestion quantités, résumé, commande
│   ├── LoginPage.jsx       # Connexion avec gestion d'erreurs
│   └── AdminDashboard.jsx  # Dashboard admin (ouvrages, commandes, users)
│
├── services/
│   └── api.js              # Couche Axios : tous les endpoints API
│
├── App.jsx                 # Routeur principal (React Router v6)
└── main.jsx                # Point d'entrée React
```

---

## 📄 Pages développées

### 1. Page d'accueil (`/`)
- **Carrousel héro** auto-play avec 3 slides (transitions CSS fluides)
- **Filtres dynamiques** : catégorie (chips), prix max (slider), tri
- **Grille responsive** : 1 → 2 → 3 → 4 colonnes selon la taille d'écran
- Bande de statistiques (livraison, qualité, retour)
- Bannière promotionnelle saisonnière

### 2. Page produit (`/livre/:id`)
- Image principale, badge stock dynamique (épuisé / faible / disponible)
- Métadonnées : éditeur, année, pages, langue, ISBN
- **Sélecteur de quantité** avec limites (min 1, max stock)
- Bouton "Ajouter au panier" avec feedback visuel
- **Onglets** : Description / Avis
- **Formulaire d'avis** avec sélection d'étoiles interactive (protégé par auth)

### 3. Panier (`/panier`)
- Liste des articles avec image, titre, auteur, prix unitaire
- **Contrôles de quantité** (+/−) avec validation stock
- Suppression individuelle avec confirmation toast
- Vidage complet du panier
- **Résumé de commande** : sous-total, livraison gratuite (≥ 49 $), TPS + TVQ québécoise, total
- Bouton commande → appel API → confirmation
- **Persistance localStorage** entre les sessions

### 4. Login (`/login`)
- Formulaire accessible avec show/hide mot de passe
- Gestion d'erreurs API (identifiants incorrects, connexion)
- Redirect automatique admin → `/admin`, user → `/`
- Indication compte démo

### 5. Dashboard Admin (`/admin`)
**Route protégée** — redirige vers `/login` si non connecté, `/` si non admin.
- **Sidebar fixe** avec navigation entre sections
- **Vue d'ensemble** : 4 cartes statistiques + tableau dernières commandes
- **Gestion ouvrages** : tableau + recherche + CRUD complet (modal ajout/édition, confirmation suppression)
- **Gestion commandes** : liste avec changement de statut inline (select)
- **Gestion utilisateurs** : liste des comptes inscrits

---

## 🔌 API — Endpoints utilisés

| Méthode | Endpoint | Usage |
|---------|----------|-------|
| GET | `/api/ouvrages` | Liste des livres (avec filtres) |
| GET | `/api/ouvrages/:id` | Détail d'un livre |
| POST | `/api/ouvrages` | Créer un livre (admin) |
| PUT | `/api/ouvrages/:id` | Modifier un livre (admin) |
| DELETE | `/api/ouvrages/:id` | Supprimer un livre (admin) |
| GET | `/api/ouvrages/:id/avis` | Avis d'un livre |
| POST | `/api/ouvrages/:id/avis` | Poster un avis |
| GET | `/api/commandes` | Liste commandes (admin) |
| POST | `/api/commandes` | Passer une commande |
| PATCH | `/api/commandes/:id/statut` | Changer statut (admin) |
| POST | `/api/auth/login` | Connexion |
| GET | `/api/utilisateurs` | Liste utilisateurs (admin) |

---

## ♿ Accessibilité (WCAG 2.1 AA)

- Lien "Aller au contenu principal" en premier élément focusable
- Tous les boutons et inputs ont des `aria-label` descriptifs
- Roles ARIA : `role="list"`, `role="alert"`, `role="alertdialog"`, `role="dialog"`, `role="tablist"`, `role="tab"`, `role="group"`, `role="radiogroup"`
- `aria-live="polite"` sur les quantités du panier
- `aria-current="page"` dans la navbar et sidebar admin
- Contrastes respectant WCAG AA (couleurs testées)
- Navigation clavier complète

---

## 🎨 Design System

| Token | Valeur | Usage |
|-------|--------|-------|
| `--cream` | `#FAF7F2` | Fond général |
| `--espresso` | `#2D1B0E` | Titres, sidebar |
| `--terracotta` | `#C4593A` | CTA principal, prix |
| `--saffron` | `#E8A838` | Accent, total panier |
| `--sage` | `#6B8F71` | Succès, stock ok |
| `--muted` | `#8A7F78` | Textes secondaires |
| `--font-display` | Playfair Display | Titres |
| `--font-body` | DM Sans | Corps de texte |

---

## 🔧 Décisions techniques

- **Axios interceptors** : injection du JWT + redirect 401 automatique
- **CartContext + useReducer** : gestion d'état prévisible et testable
- **localStorage** : hydratation initiale du reducer, sync à chaque action
- **Données mock** : fallback automatique si l'API est hors ligne (utile en dev)
- **Vite** : HMR instantané, build ES modules optimisé
- **Bootstrap 5** : uniquement pour le grid et quelques utilitaires — tout le design est en CSS custom via variables
