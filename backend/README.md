# livresgourmands.net — API REST

> Projet Web Avancée — Étape 02 : Implémentation API & Base de données  
> Cours : Programmation Web Avancée (420-WA6-AG) | Hiver 2026  
> Enseignante : Kahina Tamazouzt

---

## Membres & répartition des tâches

| Membre | Tâches |
|---|---|
| **Maryem Belouaar** | Modélisation BD, routes catégories/ouvrages, documentation Postman |
| **Mohamed Nouaoury** | Auth JWT/bcrypt, routes panier/commandes/listes, rapport technique |

---

## Description du projet

**livresgourmands.net** est une plateforme e-commerce spécialisée dans la vente de livres de cuisine. Ce dépôt contient le backend complet (API REST) construit avec Node.js + Express + MySQL.

Fonctionnalités principales :
- Authentification JWT avec gestion des rôles (client, éditeur, gestionnaire, administrateur)
- CRUD complet sur les ouvrages et catégories
- Gestion du panier et des commandes (avec décrémentation transactionnelle du stock)
- Listes de cadeaux partageables par code unique
- Système d'avis (vérification achat obligatoire) et commentaires (validation éditeur)

---

## Stack technique

- **Runtime** : Node.js
- **Framework** : Express 4
- **Base de données** : MySQL 8
- **Auth** : JSON Web Tokens (jsonwebtoken) + bcrypt
- **Validation** : express-validator
- **Versionning** : Git & GitHub

---

## Installation et démarrage

### Prérequis
- Node.js >= 18
- MySQL >= 8
- Git

### 1. Cloner le dépôt

```bash
git clone https://github.com/Med-Nouaoury/Project-Web.git
cd Project-Web/backend
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres MySQL et un secret JWT fort :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=votre_mot_de_passe
DB_NAME=livresgourmands
JWT_SECRET=votre_secret_jwt_tres_long
JWT_EXPIRES_IN=7d
```

### 4. Créer la base de données et charger les données

```bash
mysql -u root -p < sql/database.sql
```

### 5. Démarrer le serveur

```bash
# Production
npm start

# Développement (rechargement automatique)
npm run dev
```

L'API est disponible sur : `http://localhost:3000`

---

## Structure du projet

```
backend/
├── src/
│   ├── app.js                    # Point d'entrée
│   ├── config/
│   │   └── db.js                 # Pool de connexion MySQL
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── users.controller.js
│   │   ├── ouvrages.controller.js
│   │   ├── categories.controller.js
│   │   ├── panier.controller.js
│   │   ├── commandes.controller.js
│   │   ├── listes.controller.js
│   │   └── commentaires.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js    # JWT + rôles
│   │   └── validate.middleware.js
│   └── routes/
│       ├── auth.routes.js
│       ├── users.routes.js
│       ├── ouvrages.routes.js
│       ├── categories.routes.js
│       ├── panier.routes.js
│       ├── commandes.routes.js
│       ├── listes.routes.js
│       └── commentaires.routes.js
├── sql/
│   └── database.sql              # DDL + données de test
├── .env.example
└── package.json
```

---

## Endpoints API

> Remplacer `{{base}}` par `http://localhost:3000/api`  
> Les routes protégées nécessitent le header : `Authorization: Bearer <token>`

### Auth

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Inscription |
| POST | `/auth/login` | Public | Connexion → retourne JWT |

#### Exemple register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nom":"Alice","email":"alice@test.com","password":"password123"}'
```

#### Exemple login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@test.com","password":"password123"}'
```

---

### Utilisateurs

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/users/me` | Connecté | Profil personnel |
| GET | `/users` | Admin | Liste tous les utilisateurs |
| PUT | `/users/:id` | Admin ou owner | Modifier profil |
| PUT | `/users/:id/actif` | Admin | Activer/désactiver compte |

---

### Catégories

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/categories` | Public | Liste toutes les catégories |
| GET | `/categories/:id` | Public | Détail d'une catégorie |
| POST | `/categories` | Éditeur+ | Créer une catégorie |
| PUT | `/categories/:id` | Éditeur+ | Modifier |
| DELETE | `/categories/:id` | Éditeur+ | Supprimer |

---

### Ouvrages

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/ouvrages` | Public | Liste (stock > 0), filtres: `?q=`, `?categorie_id=`, `?sort=popularite\|prix_asc\|prix_desc` |
| GET | `/ouvrages/:id` | Public | Détail + avis validés + commentaires validés |
| POST | `/ouvrages` | Éditeur+ | Créer |
| PUT | `/ouvrages/:id` | Éditeur+ | Modifier |
| DELETE | `/ouvrages/:id` | Éditeur+ | Supprimer |
| POST | `/ouvrages/:id/avis` | Client (achat requis) | Ajouter un avis (note 1-5) |
| POST | `/ouvrages/:id/commentaires` | Connecté | Soumettre commentaire (valide=false) |

#### Exemple GET ouvrages avec filtre
```bash
curl "http://localhost:3000/api/ouvrages?q=cuisine&sort=popularite"
```

#### Exemple ajouter avis
```bash
curl -X POST http://localhost:3000/api/ouvrages/5/avis \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"note":5,"commentaire":"Excellent livre!"}'
```

---

### Panier

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/panier` | Client | Récupérer le panier actif |
| POST | `/panier/items` | Client | Ajouter un article |
| PUT | `/panier/items/:id` | Client | Modifier la quantité |
| DELETE | `/panier/items/:id` | Client | Retirer un article |

#### Exemple ajouter au panier
```bash
curl -X POST http://localhost:3000/api/panier/items \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"ouvrage_id":1,"quantite":2}'
```

---

### Commandes

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/commandes` | Client | Créer commande depuis le panier (décrémente stock) |
| GET | `/commandes` | Client/Admin | Historique |
| GET | `/commandes/:id` | Client (owner) ou Admin | Détail |
| PUT | `/commandes/:id/status` | Admin/Gestionnaire | Changer le statut |

#### Exemple créer commande
```bash
curl -X POST http://localhost:3000/api/commandes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"adresse_livraison":"123 rue Ste-Catherine, Montréal","mode_paiement":"carte"}'
```

---

### Listes de cadeaux

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| POST | `/listes` | Client | Créer une liste (génère code_partage) |
| GET | `/listes/:code` | Public | Consulter par code |
| POST | `/listes/:id/items` | Client (owner) | Ajouter un ouvrage |
| POST | `/listes/:id/acheter` | Connecté | Acheter depuis la liste |

---

### Commentaires

| Méthode | Endpoint | Accès | Description |
|---|---|---|---|
| GET | `/commentaires` | Éditeur+ | Liste des commentaires en attente |
| PUT | `/commentaires/:id/valider` | Éditeur+ | Valider (`valide:true`) ou rejeter (`valide:false`) |

---

## Comptes de test (seed)

| Email | Mot de passe | Rôle |
|---|---|---|
| admin@livresgourmands.net | password123 | administrateur |
| editeur@livresgourmands.net | password123 | éditeur |
| gestionnaire@livresgourmands.net | password123 | gestionnaire |
| alice@email.com | password123 | client |
| bob@email.com | password123 | client |

---

## Lien GitHub

[https://github.com/Med-Nouaoury/Project-Web](https://github.com/Med-Nouaoury/Project-Web)
