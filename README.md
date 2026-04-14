# Projet Web Avancée – livresgourmands.net

## Description du projet

**livresgourmands.net** est une plateforme de commerce électronique spécialisée dans la vente de livres de cuisine pour tous les niveaux : débutants, amateurs et chefs.

Ce projet a été réalisé dans le cadre du cours **Programmation Web avancée (420-WA6-AG)**.  
Il vise à concevoir progressivement une application web complète en plusieurs étapes, en commençant par l’analyse et la modélisation, puis en poursuivant avec l’implémentation du backend, de la base de données et de l’API REST.

---

## Informations générales

- **Cours :** Programmation Web avancée (420-WA6-AG)
- **Session :** Hiver 2026
- **Enseignante :** Kahina Tamazouzt

### Membres de l’équipe
- **Maryem Belouaar**
- **Mohamed Nouaoury**

---

# Étape 1 – Analyse et modélisation

## Objectifs de l’étape 1

L’étape 1 consistait à poser les fondations du projet en réalisant l’analyse fonctionnelle et la modélisation du système.

Les principaux objectifs étaient :

- analyser les besoins de la plateforme ;
- identifier les acteurs principaux du système ;
- définir les fonctionnalités attendues ;
- produire un diagramme de cas d’utilisation ;
- produire un diagramme de classes UML ;
- préparer une structure de dépôt GitHub claire et organisée.

## Livrables de l’étape 1

Les livrables de l’étape 1 comprennent :

- un **README.md** décrivant le projet ;
- un **diagramme de cas d’utilisation** ;
- un **diagramme de classes UML** ;
- les fichiers déposés dans le dossier **diagrammes/** du dépôt GitHub.

## Diagrammes disponibles

Le dossier **diagrammes/** contient les diagrammes réalisés pour l’étape 1 :

- diagramme de cas d’utilisation ;
- diagramme de classes UML.

---

# Étape 2 – API REST et base de données

## Objectifs de l’étape 2

L’étape 2 consistait à implémenter la partie backend du projet ainsi que la base de données relationnelle.

Les principaux objectifs étaient :

- concevoir une base de données MySQL cohérente ;
- créer un schéma relationnel conforme au diagramme de classes ;
- développer une **API REST** avec **Node.js** et **Express.js** ;
- implémenter l’authentification avec **JWT** ;
- chiffrer les mots de passe avec **bcrypt** ;
- appliquer les règles métier demandées ;
- documenter et tester les endpoints avec **Postman**.

## Technologies utilisées

Les technologies utilisées dans ce projet sont :

- **Node.js**
- **Express.js**
- **MySQL**
- **JWT (JSON Web Token)**
- **bcrypt**
- **Postman**
- **GitHub**

---

## Structure du projet

Le dépôt contient les principaux éléments suivants :

```bash
Project-Web/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── app.js
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   └── livresgourmands.sql
│
├── diagrammes/
│   └── fichiers des diagrammes UML
│
├── .gitattributes
└── README.md
