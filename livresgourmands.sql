-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 08, 2026 at 10:12 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `livresgourmands`
--

-- --------------------------------------------------------

--
-- Table structure for table `avis`
--

CREATE TABLE `avis` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `note` tinyint(4) NOT NULL CHECK (`note` between 1 and 5),
  `commentaire` text DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `avis`
--

INSERT INTO `avis` (`id`, `client_id`, `ouvrage_id`, `note`, `commentaire`, `date`) VALUES
(1, 4, 5, 5, 'Magnifique livre, des recettes vraiment originales et faciles à reproduire !', '2026-04-08 13:58:34'),
(2, 4, 9, 4, 'Très pratique pour les soirs de semaine.', '2026-04-08 13:58:34'),
(4, 4, 3, 3, NULL, '2026-04-08 15:36:32');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `nom`, `description`) VALUES
(1, 'Cuisine française', 'Recettes et techniques de la gastronomie française'),
(2, 'Pâtisserie', 'Art de la pâtisserie, viennoiseries et desserts'),
(3, 'Cuisine du monde', 'Recettes internationales et saveurs du globe'),
(4, 'Végétarien & Vegan', 'Cuisine sans viande, respectueuse de l\'environnement'),
(5, 'Cuisine rapide', 'Recettes simples et rapides pour le quotidien'),
(6, 'Cat_1775676992049', 'Test auto'),
(7, 'Cat_1775677621738', 'Test auto');

-- --------------------------------------------------------

--
-- Table structure for table `commandes`
--

CREATE TABLE `commandes` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `date` datetime NOT NULL DEFAULT current_timestamp(),
  `total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `statut` enum('en_cours','payee','annulee','expediee') NOT NULL DEFAULT 'en_cours',
  `adresse_livraison` text NOT NULL,
  `mode_livraison` varchar(100) DEFAULT NULL,
  `mode_paiement` varchar(100) DEFAULT NULL,
  `payment_provider_id` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commandes`
--

INSERT INTO `commandes` (`id`, `client_id`, `date`, `total`, `statut`, `adresse_livraison`, `mode_livraison`, `mode_paiement`, `payment_provider_id`, `created_at`, `updated_at`) VALUES
(1, 4, '2026-04-08 13:58:34', 57.99, 'payee', '123 rue Sainte-Catherine, Montréal, QC, H3B 1A7', 'standard', 'carte', NULL, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(2, 4, '2026-04-08 15:36:32', 209.98, 'payee', '123 rue Ste-Catherine, Montréal, QC', 'standard', 'carte', NULL, '2026-04-08 15:36:32', '2026-04-08 15:36:32'),
(3, 4, '2026-04-08 15:47:01', 99.98, 'payee', '123 rue Ste-Catherine, Montréal, QC', 'standard', 'carte', NULL, '2026-04-08 15:47:01', '2026-04-08 15:47:01');

-- --------------------------------------------------------

--
-- Table structure for table `commande_items`
--

CREATE TABLE `commande_items` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL CHECK (`quantite` > 0),
  `prix_unitaire` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commande_items`
--

INSERT INTO `commande_items` (`id`, `commande_id`, `ouvrage_id`, `quantite`, `prix_unitaire`) VALUES
(1, 1, 5, 1, 32.00),
(2, 1, 9, 1, 24.99),
(3, 2, 1, 2, 49.99),
(4, 2, 3, 2, 55.00),
(5, 3, 1, 2, 49.99);

-- --------------------------------------------------------

--
-- Table structure for table `commentaires`
--

CREATE TABLE `commentaires` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `contenu` text NOT NULL,
  `valide` tinyint(1) NOT NULL DEFAULT 0,
  `date_soumission` datetime NOT NULL DEFAULT current_timestamp(),
  `date_validation` datetime DEFAULT NULL,
  `valide_par` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commentaires`
--

INSERT INTO `commentaires` (`id`, `client_id`, `ouvrage_id`, `contenu`, `valide`, `date_soumission`, `date_validation`, `valide_par`) VALUES
(1, 4, 1, 'Un classique indémodable, je recommande à tous les passionnés de cuisine française.', 1, '2026-04-08 13:58:34', '2026-04-08 15:36:32', 2),
(2, 5, 3, 'Excellent livre de pâtisserie, les explications sont très claires.', 1, '2026-04-08 13:58:34', '2026-04-08 15:47:01', 2),
(3, 4, 1, 'Commentaire test automatique', 0, '2026-04-08 15:36:32', NULL, NULL),
(4, 4, 1, 'Commentaire test automatique', 0, '2026-04-08 15:47:01', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `listes_cadeaux`
--

CREATE TABLE `listes_cadeaux` (
  `id` int(11) NOT NULL,
  `nom` varchar(150) NOT NULL,
  `proprietaire_id` int(11) NOT NULL,
  `code_partage` varchar(64) NOT NULL,
  `date_creation` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `listes_cadeaux`
--

INSERT INTO `listes_cadeaux` (`id`, `nom`, `proprietaire_id`, `code_partage`, `date_creation`) VALUES
(1, 'Ma liste anniversaire 2026', 4, 'abc123xyz456def789', '2026-04-08 13:58:34'),
(2, 'Ma liste test', 4, 'b9beaf21d6234692a436', '2026-04-08 15:36:32'),
(3, 'Ma liste test', 4, 'be819e0b16eb4818b4fe', '2026-04-08 15:47:01');

-- --------------------------------------------------------

--
-- Table structure for table `liste_items`
--

CREATE TABLE `liste_items` (
  `id` int(11) NOT NULL,
  `liste_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `quantite_souhaitee` int(11) NOT NULL DEFAULT 1 CHECK (`quantite_souhaitee` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `liste_items`
--

INSERT INTO `liste_items` (`id`, `liste_id`, `ouvrage_id`, `quantite_souhaitee`) VALUES
(1, 1, 2, 1),
(2, 1, 4, 1),
(3, 2, 2, 1),
(4, 3, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ouvrages`
--

CREATE TABLE `ouvrages` (
  `id` int(11) NOT NULL,
  `titre` varchar(255) NOT NULL,
  `auteur` varchar(150) NOT NULL,
  `isbn` varchar(20) NOT NULL,
  `description` text DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL CHECK (`prix` >= 0),
  `stock` int(11) NOT NULL DEFAULT 0 CHECK (`stock` >= 0),
  `categorie_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ouvrages`
--

INSERT INTO `ouvrages` (`id`, `titre`, `auteur`, `isbn`, `description`, `prix`, `stock`, `categorie_id`, `created_at`, `updated_at`) VALUES
(1, 'L\'Escoffier Moderne', 'Paul Bocuse', '978-2-01-001001-1', 'La référence de la cuisine française classique.', 49.99, 21, 1, '2026-04-08 13:58:34', '2026-04-08 15:47:01'),
(2, 'Le Grand Larousse Gastronomique', 'Collectif', '978-2-03-584228-0', 'L\'encyclopédie incontournable de la gastronomie.', 79.99, 12, 1, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(3, 'Pâtisserie — L\'ultime référence', 'Christophe Felder', '978-2-01-200543-1', 'Plus de 200 recettes de pâtisserie détaillées pas à pas.', 55.00, 28, 2, '2026-04-08 13:58:34', '2026-04-08 15:36:32'),
(4, 'Tartes et Tourtes', 'Pierre Hermé', '978-2-01-200600-1', 'L\'art des tartes sucrées et salées selon Pierre Hermé.', 38.50, 18, 2, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(5, 'Street Food du Monde', 'Lonely Planet', '978-2-81-610843-3', 'Les meilleures recettes street food des 5 continents.', 32.00, 40, 3, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(6, 'Épices et Saveurs d\'Orient', 'Fatima Hal', '978-2-01-300120-1', 'Un voyage culinaire à travers le Maghreb et le Moyen-Orient.', 28.00, 22, 3, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(7, 'Végétarien au quotidien', 'Marie Laforêt', '978-2-81-420300-1', 'Recettes végétariennes savoureuses pour toute la famille.', 29.95, 15, 4, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(8, 'Vegan — 200 recettes', 'Héloïse Martel', '978-2-01-400200-1', 'Cuisine vegan créative et gourmande.', 26.50, 0, 4, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(9, 'Cuisine Express 30 min', 'Cyril Lignac', '978-2-01-500100-1', 'Des recettes prêtes en 30 minutes pour les soirs pressés.', 24.99, 50, 5, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(10, 'Batch Cooking Facile', 'Julie Andrieu', '978-2-01-500200-1', 'Organisez votre semaine en cuisinant une fois.', 22.00, 35, 5, '2026-04-08 13:58:34', '2026-04-08 13:58:34'),
(11, 'Test Ouvrage Auto', 'Auteur Test', '978-0-00-992067-0', 'Créé par test auto', 19.99, 5, 1, '2026-04-08 15:36:32', '2026-04-08 15:36:32'),
(12, 'Test Ouvrage Auto', 'Auteur Test', '978-0-00-621756-0', 'Test', 19.99, 5, 1, '2026-04-08 15:47:01', '2026-04-08 15:47:01');

-- --------------------------------------------------------

--
-- Table structure for table `panier`
--

CREATE TABLE `panier` (
  `id` int(11) NOT NULL,
  `client_id` int(11) NOT NULL,
  `actif` tinyint(1) NOT NULL DEFAULT 1,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `panier`
--

INSERT INTO `panier` (`id`, `client_id`, `actif`, `updated_at`) VALUES
(1, 4, 0, '2026-04-08 15:36:32'),
(2, 4, 0, '2026-04-08 15:47:01');

-- --------------------------------------------------------

--
-- Table structure for table `panier_items`
--

CREATE TABLE `panier_items` (
  `id` int(11) NOT NULL,
  `panier_id` int(11) NOT NULL,
  `ouvrage_id` int(11) NOT NULL,
  `quantite` int(11) NOT NULL DEFAULT 1 CHECK (`quantite` > 0),
  `prix_unitaire` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `panier_items`
--

INSERT INTO `panier_items` (`id`, `panier_id`, `ouvrage_id`, `quantite`, `prix_unitaire`) VALUES
(1, 1, 1, 2, 49.99),
(2, 1, 3, 2, 55.00),
(3, 2, 1, 2, 49.99);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `provider` varchar(100) NOT NULL,
  `provider_payment_id` varchar(255) DEFAULT NULL,
  `statut` varchar(50) NOT NULL DEFAULT 'pending',
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `commande_id`, `provider`, `provider_payment_id`, `statut`, `amount`, `created_at`) VALUES
(1, 1, 'stripe', 'pi_test_123456789', 'succeeded', 57.99, '2026-04-08 13:58:34');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('client','editeur','gestionnaire','administrateur') NOT NULL DEFAULT 'client',
  `actif` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `nom`, `email`, `password_hash`, `role`, `actif`, `created_at`, `updated_at`) VALUES
(1, 'Admin Principal', 'admin@livresgourmands.net', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'administrateur', 1, '2026-04-08 13:58:34', '2026-04-08 15:35:54'),
(2, 'Sophie Éditrice', 'editeur@livresgourmands.net', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'editeur', 1, '2026-04-08 13:58:34', '2026-04-08 15:35:54'),
(3, 'Marc Gestionnaire', 'gestionnaire@livresgourmands.net', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'gestionnaire', 1, '2026-04-08 13:58:34', '2026-04-08 15:35:54'),
(4, 'Alice Tremblay', 'alice@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2026-04-08 13:58:34', '2026-04-08 15:35:54'),
(5, 'Bob Martin', 'bob@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2026-04-08 13:58:34', '2026-04-08 15:35:54'),
(6, 'Test Runner', 'runner_1775675498810@test.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2026-04-08 15:11:38', '2026-04-08 15:35:54'),
(7, 'Test Runner', 'runner_1775675806551@test.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2026-04-08 15:16:46', '2026-04-08 15:35:54'),
(8, 'Test Runner', 'runner_1775675822197@test.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2026-04-08 15:17:02', '2026-04-08 15:35:54'),
(9, 'Test Runner', 'runner_1775676792695@test.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2026-04-08 15:33:12', '2026-04-08 15:35:54'),
(10, 'Test Runner', 'runner_1775676991758@test.com', '$2b$10$gFkw.806K9jOu0yfXR35N.CsODMo648MKkTb2i6uUPMyfsk/1MEma', 'client', 1, '2026-04-08 15:36:31', '2026-04-08 15:36:31'),
(11, 'Test Runner', 'runner_1775677621438@test.com', '$2b$10$R53O5R5ZqpzfVYMRIf6kxuF/ZSDNt0/a99hyt1uBhkKCkChmI2dtm', 'client', 1, '2026-04-08 15:47:01', '2026-04-08 15:47:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `avis`
--
ALTER TABLE `avis`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_avis_client_ouvrage` (`client_id`,`ouvrage_id`),
  ADD KEY `idx_avis_ouvrage` (`ouvrage_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nom` (`nom`),
  ADD KEY `idx_categories_nom` (`nom`);

--
-- Indexes for table `commandes`
--
ALTER TABLE `commandes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_commandes_client` (`client_id`),
  ADD KEY `idx_commandes_statut` (`statut`);

--
-- Indexes for table `commande_items`
--
ALTER TABLE `commande_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_commande_items_commande` (`commande_id`),
  ADD KEY `fk_commande_items_ouvrage` (`ouvrage_id`);

--
-- Indexes for table `commentaires`
--
ALTER TABLE `commentaires`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_commentaires_client` (`client_id`),
  ADD KEY `fk_commentaires_valideur` (`valide_par`),
  ADD KEY `idx_commentaires_ouvrage` (`ouvrage_id`),
  ADD KEY `idx_commentaires_valide` (`valide`);

--
-- Indexes for table `listes_cadeaux`
--
ALTER TABLE `listes_cadeaux`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_partage` (`code_partage`),
  ADD KEY `idx_listes_proprietaire` (`proprietaire_id`),
  ADD KEY `idx_listes_code` (`code_partage`);

--
-- Indexes for table `liste_items`
--
ALTER TABLE `liste_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_liste_ouvrage` (`liste_id`,`ouvrage_id`),
  ADD KEY `fk_liste_items_ouvrage` (`ouvrage_id`);

--
-- Indexes for table `ouvrages`
--
ALTER TABLE `ouvrages`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`),
  ADD KEY `idx_ouvrages_categorie` (`categorie_id`),
  ADD KEY `idx_ouvrages_titre` (`titre`),
  ADD KEY `idx_ouvrages_stock` (`stock`);

--
-- Indexes for table `panier`
--
ALTER TABLE `panier`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_panier_client` (`client_id`),
  ADD KEY `idx_panier_actif` (`actif`);

--
-- Indexes for table `panier_items`
--
ALTER TABLE `panier_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_panier_ouvrage` (`panier_id`,`ouvrage_id`),
  ADD KEY `fk_panier_items_ouvrage` (`ouvrage_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payments_commande` (`commande_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `avis`
--
ALTER TABLE `avis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `commande_items`
--
ALTER TABLE `commande_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `listes_cadeaux`
--
ALTER TABLE `listes_cadeaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `liste_items`
--
ALTER TABLE `liste_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ouvrages`
--
ALTER TABLE `ouvrages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `panier`
--
ALTER TABLE `panier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `panier_items`
--
ALTER TABLE `panier_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `avis`
--
ALTER TABLE `avis`
  ADD CONSTRAINT `fk_avis_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_avis_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `commandes`
--
ALTER TABLE `commandes`
  ADD CONSTRAINT `fk_commandes_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `commande_items`
--
ALTER TABLE `commande_items`
  ADD CONSTRAINT `fk_commande_items_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_commande_items_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`);

--
-- Constraints for table `commentaires`
--
ALTER TABLE `commentaires`
  ADD CONSTRAINT `fk_commentaires_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_commentaires_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_commentaires_valideur` FOREIGN KEY (`valide_par`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `listes_cadeaux`
--
ALTER TABLE `listes_cadeaux`
  ADD CONSTRAINT `fk_listes_cadeaux_proprietaire` FOREIGN KEY (`proprietaire_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `liste_items`
--
ALTER TABLE `liste_items`
  ADD CONSTRAINT `fk_liste_items_liste` FOREIGN KEY (`liste_id`) REFERENCES `listes_cadeaux` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_liste_items_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`);

--
-- Constraints for table `ouvrages`
--
ALTER TABLE `ouvrages`
  ADD CONSTRAINT `fk_ouvrages_categorie` FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `panier`
--
ALTER TABLE `panier`
  ADD CONSTRAINT `fk_panier_client` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `panier_items`
--
ALTER TABLE `panier_items`
  ADD CONSTRAINT `fk_panier_items_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`),
  ADD CONSTRAINT `fk_panier_items_panier` FOREIGN KEY (`panier_id`) REFERENCES `panier` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payments_commande` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
