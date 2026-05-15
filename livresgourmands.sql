-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 15, 2026 at 03:00 PM
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
(1, 4, 1, 5, 'Magnifique référence, indispensable dans toute cuisine !', '2025-02-15 10:00:00'),
(2, 4, 9, 4, 'Très pratique pour les soirs de semaine, recettes rapides.', '2025-02-16 11:00:00'),
(3, 4, 10, 5, 'Le batch cooking a changé ma vie ! Je recommande vivement.', '2025-02-17 12:00:00'),
(4, 4, 5, 4, 'Beau voyage culinaire, photos magnifiques.', '2025-02-18 09:00:00'),
(5, 4, 7, 5, 'Parfait pour adopter une alimentation végétarienne.', '2025-03-10 10:00:00'),
(6, 4, 3, 5, 'La bible de la pâtisserie, explications claires et précises.', '2025-05-12 11:00:00'),
(7, 5, 3, 4, 'Excellent livre de pâtisserie, les explications sont très claires.', '2025-03-20 14:00:00'),
(8, 5, 4, 3, 'Bon livre mais certaines recettes manquent de détails.', '2025-03-21 15:00:00'),
(9, 5, 18, 5, 'Le chocolat selon Genin, un chef-d\'oeuvre absolu.', '2025-03-22 16:00:00'),
(10, 6, 11, 4, 'Guide complet et bien organisé pour découvrir les vins.', '2025-04-10 10:00:00'),
(11, 6, 12, 5, 'Enfin un guide pratique sur les accords mets-vins !', '2025-04-11 11:00:00'),
(12, 6, 6, 4, 'Belles recettes d\'orient, très inspirant.', '2025-04-12 12:00:00'),
(13, 7, 15, 5, 'La cuisine japonaise rendue accessible, superbe !', '2025-04-18 10:00:00'),
(14, 7, 16, 4, 'Apprentissage des sushis facilité, très beau livre.', '2025-04-19 11:00:00'),
(15, 7, 20, 5, 'Authentique et généreux, les tajines sont excellents.', '2025-04-20 12:00:00'),
(16, 8, 9, 3, 'Bien mais certaines recettes prennent plus de 30 min.', '2025-04-25 10:00:00'),
(17, 8, 10, 4, 'Très bonne organisation hebdomadaire.', '2025-04-26 11:00:00'),
(18, 9, 13, 5, 'Le pain maison na plus de secrets grace a ce livre.', '2025-05-03 10:00:00'),
(19, 9, 14, 4, 'Croissants réussis dès le premier essai !', '2025-05-04 11:00:00'),
(20, 10, 2, 5, 'L\'encyclopédie gastronomique par excellence.', '2025-05-06 10:00:00'),
(21, 10, 1, 4, 'Un classique indémodable, je recommande.', '2025-05-07 11:00:00'),
(22, 11, 10, 4, 'Pratique pour organiser ses repas de la semaine.', '2025-05-08 10:00:00');

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
(6, 'Vins & Accords', 'Œnologie, accords mets-vins et caves'),
(7, 'Boulangerie', 'Pain, viennoiseries et recettes de boulanger');

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
(1, 4, '2025-02-10 10:00:00', 107.99, 'payee', '123 rue Sainte-Catherine, Montréal, QC H3B 1A7', 'standard', 'carte', NULL, '2025-02-10 10:00:00', '2026-05-14 16:00:19'),
(2, 4, '2025-03-05 14:30:00', 57.95, 'expediee', '123 rue Sainte-Catherine, Montréal, QC H3B 1A7', 'express', 'carte', NULL, '2025-03-05 14:30:00', '2026-05-14 16:00:19'),
(3, 5, '2025-03-12 09:15:00', 134.98, 'payee', '456 av. du Mont-Royal, Montréal, QC H2J 1W5', 'standard', 'carte', NULL, '2025-03-12 09:15:00', '2026-05-14 16:00:19'),
(4, 5, '2025-03-28 16:00:00', 79.99, 'annulee', '456 av. du Mont-Royal, Montréal, QC H2J 1W5', 'standard', 'carte', NULL, '2025-03-28 16:00:00', '2026-05-14 16:00:19'),
(5, 6, '2025-04-02 11:30:00', 82.00, 'payee', '789 boul. Saint-Laurent, Montréal, QC H2Y 2Y9', 'standard', 'paypal', NULL, '2025-04-02 11:30:00', '2026-05-14 16:00:19'),
(6, 7, '2025-04-10 13:00:00', 159.97, 'expediee', '321 rue Notre-Dame O, Montréal, QC H2Y 1T9', 'express', 'carte', NULL, '2025-04-10 13:00:00', '2026-05-14 16:00:19'),
(7, 8, '2025-04-18 15:45:00', 76.94, 'payee', '654 rue Sherbrooke E, Montréal, QC H2L 1K5', 'standard', 'carte', NULL, '2025-04-18 15:45:00', '2026-05-14 16:00:19'),
(8, 9, '2025-04-25 09:00:00', 94.00, 'en_cours', '987 av. Papineau, Montréal, QC H2K 4J8', 'standard', 'carte', NULL, '2025-04-25 09:00:00', '2026-05-14 16:00:19'),
(9, 10, '2025-05-01 10:30:00', 129.98, 'payee', '147 rue de la Commune, Vieux-Montréal, QC', 'standard', 'carte', NULL, '2025-05-01 10:30:00', '2026-05-14 16:00:19'),
(10, 11, '2025-05-05 14:00:00', 44.00, 'expediee', '258 rue Wellington, Verdun, QC H4G 1W5', 'standard', 'carte', NULL, '2025-05-05 14:00:00', '2026-05-14 16:00:19'),
(11, 4, '2025-05-08 11:00:00', 93.50, 'payee', '123 rue Sainte-Catherine, Montréal, QC H3B 1A7', 'express', 'carte', NULL, '2025-05-08 11:00:00', '2026-05-14 16:00:19'),
(12, 6, '2025-05-09 16:30:00', 49.99, 'en_cours', '789 boul. Saint-Laurent, Montréal, QC H2Y 2Y9', 'standard', 'paypal', NULL, '2025-05-09 16:30:00', '2026-05-14 16:00:19'),
(13, 5, '2025-05-10 09:45:00', 175.97, 'payee', '456 av. du Mont-Royal, Montréal, QC H2J 1W5', 'express', 'carte', NULL, '2025-05-10 09:45:00', '2026-05-14 16:00:19'),
(14, 7, '2025-05-11 13:15:00', 63.00, 'en_cours', '321 rue Notre-Dame O, Montréal, QC H2Y 1T9', 'standard', 'carte', NULL, '2025-05-11 13:15:00', '2026-05-14 16:00:19'),
(15, 8, '2025-05-12 10:00:00', 97.00, 'en_cours', '654 rue Sherbrooke E, Montréal, QC H2L 1K5', 'standard', 'carte', NULL, '2025-05-12 10:00:00', '2026-05-14 16:00:19');

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
(1, 1, 1, 1, 49.99),
(2, 1, 9, 1, 24.99),
(3, 1, 10, 1, 22.00),
(4, 1, 5, 1, 32.00),
(5, 2, 7, 1, 29.95),
(6, 2, 10, 1, 22.00),
(7, 2, 19, 1, 27.00),
(8, 3, 3, 1, 55.00),
(9, 3, 4, 1, 38.50),
(10, 3, 18, 1, 48.00),
(11, 4, 2, 1, 79.99),
(12, 5, 11, 1, 42.00),
(13, 5, 12, 1, 34.00),
(14, 5, 6, 1, 28.00),
(15, 6, 15, 1, 44.00),
(16, 6, 16, 1, 58.00),
(17, 6, 20, 1, 39.00),
(18, 6, 6, 1, 28.00),
(19, 7, 9, 1, 24.99),
(20, 7, 10, 1, 22.00),
(21, 7, 7, 1, 29.95),
(22, 8, 13, 1, 36.00),
(23, 8, 14, 1, 31.00),
(24, 8, 19, 1, 27.00),
(25, 9, 2, 1, 79.99),
(26, 9, 1, 1, 49.99),
(27, 10, 10, 2, 22.00),
(28, 11, 3, 1, 55.00),
(29, 11, 4, 1, 38.50),
(30, 12, 1, 1, 49.99),
(31, 13, 16, 1, 58.00),
(32, 13, 15, 1, 44.00),
(33, 13, 2, 1, 79.99),
(34, 14, 13, 1, 36.00),
(35, 14, 19, 1, 27.00),
(36, 15, 11, 1, 42.00),
(37, 15, 3, 1, 55.00);

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
(1, 4, 1, 'Un classique indémodable, je recommande à tous les passionnés de cuisine française.', 1, '2025-02-15 10:30:00', '2025-02-16 09:00:00', 2),
(2, 5, 3, 'Excellent livre de pâtisserie, les explications sont très claires et les photos superbes.', 1, '2025-03-20 14:30:00', '2025-03-21 09:00:00', 2),
(3, 6, 11, 'Ce guide des vins est remarquable, accessible même pour les débutants.', 1, '2025-04-10 10:30:00', '2025-04-11 09:00:00', 2),
(4, 7, 15, 'La cuisine japonaise du quotidien enfin expliquée simplement !', 1, '2025-04-18 10:30:00', '2025-04-19 09:00:00', 2),
(5, 8, 9, 'Pratique pour les soirs de semaine chargés.', 1, '2025-04-25 10:30:00', '2025-04-26 09:00:00', 2),
(6, 9, 13, 'Mon pain fait maison est maintenant délicieux grace à ce livre.', 1, '2025-05-03 10:30:00', '2025-05-04 09:00:00', 2),
(7, 4, 5, 'Commentaire en attente - Street food incroyable !', 0, '2025-05-10 10:00:00', NULL, NULL),
(8, 5, 18, 'En attente - Le chocolat de Genin est divin.', 0, '2025-05-11 10:00:00', NULL, NULL),
(9, 10, 2, 'En attente - L\'encyclopédie parfaite pour tout gastronome.', 0, '2025-05-12 10:00:00', NULL, NULL);

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
(1, 'Ma liste anniversaire 2025', 4, 'alice2025anniv123456', '2025-03-01 10:00:00'),
(2, 'Cadeaux Noel cuisine', 5, 'bob2025noel12345678', '2025-04-01 10:00:00'),
(3, 'Wishlist gastronomie', 6, 'claire2025gastro1234', '2025-04-15 10:00:00');

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
(2, 1, 3, 1),
(3, 1, 16, 1),
(4, 2, 11, 1),
(5, 2, 15, 1),
(6, 3, 2, 1),
(7, 3, 18, 1),
(8, 3, 20, 1);

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
(1, 'L\'Escoffier Moderne', 'Paul Bocuse', '978-2-01-001001-1', 'La référence de la cuisine française classique.', 49.99, 25, 1, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(2, 'Le Grand Larousse Gastronomique', 'Collectif', '978-2-03-584228-0', 'L\'encyclopédie incontournable de la gastronomie.', 79.99, 12, 1, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(3, 'Pâtisserie — L\'ultime référence', 'Christophe Felder', '978-2-01-200543-1', 'Plus de 200 recettes de pâtisserie détaillées pas à pas.', 55.00, 30, 2, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(4, 'Tartes et Tourtes', 'Pierre Hermé', '978-2-01-200600-1', 'L\'art des tartes sucrées et salées selon Pierre Hermé.', 38.50, 18, 2, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(5, 'Street Food du Monde', 'Lonely Planet', '978-2-81-610843-3', 'Les meilleures recettes street food des 5 continents.', 32.00, 45, 3, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(6, 'Épices et Saveurs d\'Orient', 'Fatima Hal', '978-2-01-300120-1', 'Un voyage culinaire à travers le Maghreb et le Moyen-Orient.', 28.00, 22, 3, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(7, 'Végétarien au quotidien', 'Marie Laforêt', '978-2-81-420300-1', 'Recettes végétariennes savoureuses pour toute la famille.', 29.95, 15, 4, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(8, 'Vegan — 200 recettes', 'Héloïse Martel', '978-2-01-400200-1', 'Cuisine vegan créative et gourmande.', 26.50, 0, 4, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(9, 'Cuisine Express 30 min', 'Cyril Lignac', '978-2-01-500100-1', 'Des recettes prêtes en 30 minutes pour les soirs pressés.', 24.99, 55, 5, '2025-01-10 00:00:00', '2026-05-14 16:00:19'),
(10, 'Batch Cooking Facile', 'Julie Andrieu', '978-2-01-500200-1', 'Organisez votre semaine en cuisinant une fois.', 22.00, 1, 5, '2025-01-10 00:00:00', '2026-05-14 16:04:45'),
(11, 'Le Guide des Vins de France', 'Michel Bettane', '978-2-01-600100-1', 'Le guide de référence pour découvrir les vins français.', 42.00, 20, 6, '2025-02-01 00:00:00', '2026-05-14 16:00:19'),
(12, 'Accords Mets et Vins', 'Thierry Desseauve', '978-2-01-600200-1', 'Marier les vins avec les plats pour sublimer vos repas.', 34.00, 16, 6, '2025-02-01 00:00:00', '2026-05-14 16:00:19'),
(13, 'Le Pain Maison', 'Eric Kayser', '978-2-01-700100-1', 'Fabriquer son pain artisanal à la maison, recettes et techniques.', 36.00, 28, 7, '2025-02-15 00:00:00', '2026-05-14 16:00:19'),
(14, 'Viennoiseries & Brioches', 'Christophe Adam', '978-2-01-700200-1', 'Croissants, pains au chocolat et brioches comme un chef.', 31.00, 14, 7, '2025-02-15 00:00:00', '2026-05-14 16:00:19'),
(15, 'Cuisine du Japon', 'Harumi Kurihara', '978-2-01-300300-1', 'Les secrets de la cuisine japonaise du quotidien.', 44.00, 20, 3, '2025-03-01 00:00:00', '2026-05-14 16:00:19'),
(16, 'Sushi & Sashimi', 'Nobu Matsuhisa', '978-2-01-300400-1', 'Maîtrisez l\'art du sushi avec le chef Nobu.', 58.00, 8, 3, '2025-03-01 00:00:00', '2026-05-14 16:00:19'),
(17, 'La Cuisine de Provence', 'René Berard', '978-2-01-001200-1', 'Les saveurs authentiques du Sud de la France.', 35.00, 22, 1, '2025-03-15 00:00:00', '2026-05-14 16:00:19'),
(18, 'Chocolat — Grand Art', 'Jacques Genin', '978-2-01-200700-1', 'Ganaches, truffes et tablettes par le maître chocolatier.', 48.00, 10, 2, '2025-03-15 00:00:00', '2026-05-14 16:00:19'),
(19, 'Salades Créatives', 'Yotam Ottolenghi', '978-2-01-400400-1', '100 salades originales et végétariennes pour toutes les saisons.', 27.00, 0, 4, '2025-04-01 00:00:00', '2026-05-14 16:03:52'),
(20, 'Cuisine Marocaine', 'Paula Wolfert', '978-2-01-300500-1', 'Les recettes authentiques du Maroc, tajines et couscous.', 39.00, 0, 3, '2025-04-01 00:00:00', '2026-05-14 16:04:20');

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
(1, 4, 1, '2026-05-14 16:00:19'),
(2, 5, 1, '2026-05-14 16:00:19'),
(3, 6, 0, '2026-05-14 16:00:19'),
(4, 7, 1, '2026-05-14 16:00:19');

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
(1, 1, 6, 1, 28.00),
(2, 1, 17, 1, 35.00),
(3, 2, 20, 2, 39.00),
(4, 4, 13, 1, 36.00),
(5, 4, 5, 1, 32.00);

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
(1, 1, 'stripe', 'pi_test_001', 'succeeded', 107.99, '2025-02-10 10:05:00'),
(2, 2, 'stripe', 'pi_test_002', 'succeeded', 57.95, '2025-03-05 14:35:00'),
(3, 3, 'stripe', 'pi_test_003', 'succeeded', 134.98, '2025-03-12 09:20:00'),
(4, 5, 'paypal', 'PAY-001', 'succeeded', 82.00, '2025-04-02 11:35:00'),
(5, 6, 'stripe', 'pi_test_006', 'succeeded', 159.97, '2025-04-10 13:05:00'),
(6, 7, 'stripe', 'pi_test_007', 'succeeded', 76.94, '2025-04-18 15:50:00'),
(7, 9, 'stripe', 'pi_test_009', 'succeeded', 129.98, '2025-05-01 10:35:00'),
(8, 10, 'stripe', 'pi_test_010', 'succeeded', 44.00, '2025-05-05 14:05:00'),
(9, 11, 'stripe', 'pi_test_011', 'succeeded', 93.50, '2025-05-08 11:05:00'),
(10, 13, 'stripe', 'pi_test_013', 'succeeded', 175.97, '2025-05-10 09:50:00');

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
(1, 'Admin Principal', 'admin@livresgourmands.net', '$2b$10$nFc.2dXs3Lb11ZSp3IF4y.t4esfgk1zlfrYDmtup0po6gf1JyJ2ue', 'administrateur', 1, '2025-01-01 08:00:00', '2026-05-14 16:02:08'),
(2, 'Sophie Éditrice', 'editeur@livresgourmands.net', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'editeur', 1, '2025-01-02 09:00:00', '2026-05-14 16:00:19'),
(3, 'Marc Gestionnaire', 'gestionnaire@livresgourmands.net', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'gestionnaire', 1, '2025-01-03 10:00:00', '2026-05-14 16:00:19'),
(4, 'Alice Tremblay', 'alice@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2025-02-01 11:00:00', '2026-05-14 16:00:19'),
(5, 'Bob Martin', 'bob@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2025-02-15 12:00:00', '2026-05-14 16:00:19'),
(6, 'Claire Dubois', 'claire@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2025-03-01 09:30:00', '2026-05-14 16:00:19'),
(7, 'David Côté', 'david@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2025-03-10 14:00:00', '2026-05-14 16:00:19'),
(8, 'Emma Gagnon', 'emma@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2025-03-20 16:00:00', '2026-05-14 16:00:19'),
(9, 'Félix Lavoie', 'felix@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2025-04-05 10:00:00', '2026-05-14 16:00:19'),
(10, 'Gabrielle Roy', 'gabrielle@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2025-04-20 11:00:00', '2026-05-14 16:00:19'),
(11, 'Hugo Bouchard', 'hugo@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 1, '2025-05-01 08:30:00', '2026-05-14 16:00:19'),
(12, 'Isabelle Fortin', 'isabelle@email.com', '$2b$10$m0r6ga0b5KegebvY1AY0VO.v.MOtPSPiqOh.V1cgjLHeFfhrVSIWm', 'client', 0, '2025-05-15 09:00:00', '2026-05-14 16:00:19'),
(13, 'Mohamed Nouaoury', 'mohamednouaoury2003@gmail.com', '$2b$10$nFc.2dXs3Lb11ZSp3IF4y.t4esfgk1zlfrYDmtup0po6gf1JyJ2ue', 'client', 1, '2026-05-14 16:01:37', '2026-05-14 16:01:37');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `commande_items`
--
ALTER TABLE `commande_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `listes_cadeaux`
--
ALTER TABLE `listes_cadeaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `liste_items`
--
ALTER TABLE `liste_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `ouvrages`
--
ALTER TABLE `ouvrages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `panier`
--
ALTER TABLE `panier`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `panier_items`
--
ALTER TABLE `panier_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

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
