-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 20, 2026 at 06:52 AM
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
(23, 4, 24, 5, 'La bible de la pâtisserie, explications claires et précises.', '2026-05-16 10:00:00'),
(24, 5, 25, 4, 'Un classique indémodable, je recommande à tous.', '2026-05-17 11:00:00'),
(25, 6, 26, 5, 'Beau voyage culinaire, photos magnifiques.', '2026-05-17 14:00:00'),
(26, 7, 27, 4, 'Parfait pour adopter une alimentation végétarienne.', '2026-05-18 09:00:00'),
(27, 8, 28, 3, 'Bien mais certaines recettes prennent plus de 30 min.', '2026-05-18 16:00:00'),
(28, 9, 24, 5, 'Incroyable, j\'ai réussi des macarons du premier coup !', '2026-05-19 07:30:00'),
(29, 10, 26, 4, 'Super pour découvrir les cuisines du monde.', '2026-05-19 08:30:00'),
(30, 5, 24, 5, 'Je suis pâtissier amateur depuis 10 ans et ce livre m\'a appris des techniques que je ne connaissais pas. Les explications pas à pas avec photos sont incomparables. Mes entremets ont atteint un niveau professionnel grâce à cet ouvrage.', '2026-05-17 09:00:00'),
(31, 6, 24, 4, 'Excellent livre, très complet. Certaines recettes sont techniques et demandent du matériel spécifique, mais les résultats valent vraiment l\'effort. La recette de l\'opéra est parfaite.', '2026-05-18 11:00:00'),
(32, 7, 24, 5, 'Le meilleur livre de pâtisserie que j\'aie jamais acheté. Les macarons du premier coup, c\'est possible grâce aux conseils ultra-détaillés de Felder. Je l\'offre à toute ma famille.', '2026-05-19 10:00:00'),
(33, 4, 25, 5, 'Un monument de la cuisine française. Je l\'utilise comme référence depuis des années dans ma cuisine professionnelle. La sauce beurre blanc de la page 234 est définitive — rien à y changer.', '2026-05-18 08:00:00'),
(34, 6, 25, 4, 'Très belle mise à jour du classique d\'Escoffier par Bocuse. Les techniques de base sont expliquées avec rigueur. Idéal pour les personnes qui veulent vraiment maîtriser la cuisine française.', '2026-05-19 09:00:00'),
(35, 8, 25, 5, 'Je suis cuisinier de formation et ce livre reste sur mon plan de travail tous les jours. Une référence absolue que tout cuisinier sérieux doit posséder.', '2026-05-19 11:00:00'),
(36, 4, 26, 4, 'Livre magnifique avec des photos époustouflantes. Les recettes sont authentiques — j\'ai fait les tacos al pastor et c\'était exactement comme au Mexique. Quelques ingrédients sont difficiles à trouver mais ça vaut le détour.', '2026-05-18 14:00:00'),
(37, 5, 26, 5, 'Un vrai coup de cœur ! Chaque page est une invitation au voyage. Les banh mi vietnamiens sont devenus notre plat du dimanche. Les explications sur les cultures culinaires locales ajoutent une vraie valeur au livre.', '2026-05-19 07:00:00'),
(38, 8, 26, 4, 'Très bel ouvrage pour les amoureux de voyage et de cuisine. Les recettes sont bien adaptées pour les cuisines occidentales tout en gardant l\'authenticité. Je recommande !', '2026-05-19 12:00:00'),
(39, 5, 27, 5, 'Ce livre a complètement transformé ma façon de cuisiner végétarien. Fini les plats fades — chaque recette est généreuse en saveurs et en textures. Le curry de pois chiches et les lasagnes aux légumes grillés sont devenus des classiques à la maison.', '2026-05-18 10:00:00'),
(40, 9, 27, 4, 'Très bon livre pour débuter la cuisine végétarienne. Les recettes sont accessibles et les résultats bluffants. J\'ai particulièrement apprécié les conseils nutritionnels qui prouvent qu\'on peut manger végéta sans se priver.', '2026-05-19 08:00:00'),
(41, 11, 27, 5, 'Marie Laforêt est une vraie pionnière. Ce livre prouve haut et fort que la cuisine végétale peut être festive, créative et délicieuse. Je l\'offre à tous mes amis qui veulent réduire leur consommation de viande.', '2026-05-19 10:30:00'),
(42, 4, 28, 4, 'Exactement ce que je cherchais pour les soirs de semaine. Les recettes sont vraiment rapides et savoureuses. Le poulet citron-thym et les pâtes aux courgettes sont parfaits. Attention : certaines recettes dépassent légèrement les 30 min si on est débutant.', '2026-05-17 20:00:00'),
(43, 5, 28, 5, 'Ce livre a changé mes habitudes alimentaires ! Avant je commandais souvent des pizzas le soir — maintenant je cuisine en 25 minutes avec ce livre. Les astuces de Cyril Lignac pour gagner du temps sont vraiment efficaces.', '2026-05-18 19:00:00'),
(44, 9, 28, 4, 'Très bon rapport qualité-temps. Les recettes sont bien expliquées et adaptées aux cuisiniers de tous niveaux. J\'aurais aimé plus de recettes végétariennes mais dans l\'ensemble c\'est excellent.', '2026-05-19 06:00:00'),
(45, 11, 28, 5, 'Mon livre de cuisine préféré depuis des années. Cyril Lignac a le don de rendre la cuisine accessible et gourmande. Le risotto express est aussi bon qu\'un risotto classique qui prend 45 minutes !', '2026-05-19 11:30:00'),
(46, 13, 26, 2, 'SOOOOOOOOOOO BAD', '2026-05-20 00:48:33');

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
(15, 8, '2025-05-12 10:00:00', 97.00, 'en_cours', '654 rue Sherbrooke E, Montréal, QC H2L 1K5', 'standard', 'carte', NULL, '2025-05-12 10:00:00', '2026-05-14 16:00:19'),
(16, 13, '2026-05-15 09:00:00', 84.00, 'payee', '45 rue Saint-Denis, Montréal, QC H2X 3K4', 'standard', 'carte', NULL, '2026-05-15 09:00:00', '2026-05-19 01:29:13'),
(17, 14, '2026-05-16 10:30:00', 54.99, 'expediee', '12 av. Victoria, Montréal, QC H3Z 2M1', 'express', 'carte', NULL, '2026-05-16 10:30:00', '2026-05-19 01:29:13'),
(18, 4, '2026-05-17 11:00:00', 112.00, 'payee', '123 rue Sainte-Catherine, Montréal, QC', 'standard', 'carte', NULL, '2026-05-17 11:00:00', '2026-05-19 01:29:13'),
(19, 5, '2026-05-17 14:00:00', 57.00, 'en_cours', '456 av. du Mont-Royal, Montréal, QC', 'standard', 'paypal', NULL, '2026-05-17 14:00:00', '2026-05-19 01:29:13'),
(20, 6, '2026-05-18 08:30:00', 30.00, 'en_cours', '789 boul. Saint-Laurent, Montréal, QC', 'standard', 'carte', NULL, '2026-05-18 08:30:00', '2026-05-19 01:29:13'),
(21, 7, '2026-05-18 13:00:00', 79.99, 'payee', '321 rue Notre-Dame O, Montréal, QC', 'express', 'carte', NULL, '2026-05-18 13:00:00', '2026-05-19 01:29:13'),
(22, 8, '2026-05-18 15:30:00', 55.00, 'en_cours', '654 rue Sherbrooke E, Montréal, QC', 'standard', 'carte', NULL, '2026-05-18 15:30:00', '2026-05-19 01:29:13'),
(23, 9, '2026-05-19 07:00:00', 64.00, 'en_cours', '987 av. Papineau, Montréal, QC', 'standard', 'carte', NULL, '2026-05-19 07:00:00', '2026-05-19 01:29:13'),
(24, 10, '2026-05-19 08:00:00', 49.99, 'payee', '147 rue de la Commune, Vieux-Montréal, QC', 'standard', 'carte', NULL, '2026-05-19 08:00:00', '2026-05-19 01:29:13'),
(25, 11, '2026-05-19 09:15:00', 25.00, 'en_cours', '258 rue Wellington, Verdun, QC', 'standard', 'carte', NULL, '2026-05-19 09:15:00', '2026-05-19 01:29:13'),
(26, 1, '2026-05-20 00:14:29', 115.00, 'en_cours', 'Non spécifiée', 'standard', 'carte', NULL, '2026-05-20 00:14:29', '2026-05-20 00:14:29'),
(27, 1, '2026-05-20 00:15:02', 249.95, 'expediee', 'Non spécifiée', 'standard', 'carte', NULL, '2026-05-20 00:15:02', '2026-05-20 00:18:19');

-- --------------------------------------------------------

--
-- Table structure for table `commande_items`
--

CREATE TABLE `commande_items` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `ouvrage_id` int(11) DEFAULT NULL,
  `quantite` int(11) NOT NULL CHECK (`quantite` > 0),
  `prix_unitaire` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commande_items`
--

INSERT INTO `commande_items` (`id`, `commande_id`, `ouvrage_id`, `quantite`, `prix_unitaire`) VALUES
(1, 1, NULL, 1, 49.99),
(2, 1, NULL, 1, 24.99),
(3, 1, NULL, 1, 22.00),
(4, 1, NULL, 1, 32.00),
(5, 2, NULL, 1, 29.95),
(6, 2, NULL, 1, 22.00),
(7, 2, NULL, 1, 27.00),
(8, 3, NULL, 1, 55.00),
(9, 3, NULL, 1, 38.50),
(10, 3, NULL, 1, 48.00),
(11, 4, NULL, 1, 79.99),
(12, 5, NULL, 1, 42.00),
(13, 5, NULL, 1, 34.00),
(14, 5, NULL, 1, 28.00),
(15, 6, NULL, 1, 44.00),
(16, 6, NULL, 1, 58.00),
(17, 6, NULL, 1, 39.00),
(18, 6, NULL, 1, 28.00),
(19, 7, NULL, 1, 24.99),
(20, 7, NULL, 1, 22.00),
(21, 7, NULL, 1, 29.95),
(22, 8, NULL, 1, 36.00),
(23, 8, NULL, 1, 31.00),
(24, 8, NULL, 1, 27.00),
(25, 9, NULL, 1, 79.99),
(26, 9, NULL, 1, 49.99),
(27, 10, NULL, 2, 22.00),
(28, 11, NULL, 1, 55.00),
(29, 11, NULL, 1, 38.50),
(30, 12, NULL, 1, 49.99),
(31, 13, NULL, 1, 58.00),
(32, 13, NULL, 1, 44.00),
(33, 13, NULL, 1, 79.99),
(34, 14, NULL, 1, 36.00),
(35, 14, NULL, 1, 27.00),
(36, 15, NULL, 1, 42.00),
(37, 15, NULL, 1, 55.00),
(38, 16, 26, 1, 32.00),
(39, 16, 28, 1, 25.00),
(40, 16, 27, 1, 30.00),
(41, 17, 25, 1, 49.99),
(42, 17, 24, 1, 55.00),
(43, 18, 24, 1, 55.00),
(44, 18, 26, 1, 32.00),
(45, 18, 28, 1, 25.00),
(46, 19, 27, 1, 30.00),
(47, 19, 26, 1, 32.00),
(48, 20, 28, 1, 25.00),
(49, 20, NULL, 1, 39.00),
(50, 21, 25, 1, 49.99),
(51, 21, 28, 1, 25.00),
(52, 22, 24, 1, 55.00),
(53, 23, 26, 2, 32.00),
(54, 24, 25, 1, 49.99),
(55, 25, 28, 1, 25.00),
(56, 26, 28, 1, 25.00),
(57, 26, 27, 3, 30.00),
(58, 27, 25, 5, 49.99);

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
(10, 4, 24, 'Ce livre de pâtisserie est exceptionnel, je le recommande à tous les passionnés.', 1, '2026-05-16 10:30:00', '2026-05-17 09:00:00', 2),
(11, 5, 25, 'L\'Escoffier Moderne mérite vraiment son titre de référence classique.', 1, '2026-05-17 11:30:00', '2026-05-18 09:00:00', 2),
(12, 6, 26, 'Street Food du Monde est une vraie invitation au voyage culinaire !', 1, '2026-05-17 14:30:00', '2026-05-18 09:00:00', 2),
(13, 13, 28, 'Cuisine Express idéal pour les soirs de semaine chargés.', 0, '2026-05-19 07:00:00', NULL, NULL),
(14, 14, 24, 'La pâtisserie française rendue accessible, bravo !', 0, '2026-05-19 09:00:00', NULL, NULL),
(16, 5, 24, 'Le livre de Felder est une véritable encyclopédie de la pâtisserie. Je le consulte chaque semaine depuis 3 ans et je découvre encore de nouvelles techniques. Un investissement qui vaut chaque dollar.', 1, '2026-05-17 09:30:00', '2026-05-18 08:00:00', 2),
(17, 8, 25, 'L\'Escoffier Moderne de Bocuse est une référence que tout cuisinier sérieux doit avoir dans sa bibliothèque. Les bases y sont expliquées avec une précision rare.', 1, '2026-05-19 11:30:00', '2026-05-19 14:00:00', 2),
(18, 5, 26, 'Street Food du Monde est bien plus qu\'un livre de recettes — c\'est un carnet de voyage culinaire. Les photos sont magnifiques et les recettes authentiques.', 1, '2026-05-19 07:30:00', '2026-05-19 14:00:00', 2),
(19, 11, 27, 'Végétarien au quotidien de Marie Laforêt m\'a convaincu que manger végétarien peut être délicieux et satisfaisant. Je ne retournerai pas en arrière !', 1, '2026-05-19 10:45:00', '2026-05-19 14:00:00', 2),
(20, 11, 28, 'Cuisine Express 30 min a révolutionné mes soirées. Je rentre du travail et en 25 minutes j\'ai un repas digne d\'un restaurant sur la table.', 0, '2026-05-19 12:00:00', NULL, NULL),
(21, 10, 27, 'J\'ai offert ce livre à ma sœur qui souhaitait manger moins de viande. Elle l\'adore et cuisine végétarien 4 soirs par semaine maintenant.', 0, '2026-05-19 13:00:00', NULL, NULL);

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
(3, 'Wishlist gastronomie', 6, 'claire2025gastro1234', '2025-04-15 10:00:00'),
(4, 'Ma liste test', 4, '21cadd11cab744ddb39f', '2026-05-20 00:05:17');

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
  `image_url` varchar(255) DEFAULT NULL,
  `categorie_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ouvrages`
--

INSERT INTO `ouvrages` (`id`, `titre`, `auteur`, `isbn`, `description`, `prix`, `stock`, `image_url`, `categorie_id`, `created_at`, `updated_at`) VALUES
(24, 'Pâtisserie — L\'ultime référence', 'Christophe Felder', '978-2-01-200543-1', 'La référence absolue de la pâtisserie française signée Christophe Felder. Cet ouvrage monumental de plus de 900 pages rassemble toutes les techniques fondamentales et les recettes emblématiques de la pâtisserie classique et moderne. Des bases incontournables comme la pâte feuilletée, la crème pâtissière et la génoise, jusqu\'aux entremets sophistiqués, macarons et pièces montées — tout y est expliqué avec une clarté et une précision exceptionnelles. Illustré de milliers de photos étape par étape, ce livre est un véritable compagnon de vie pour tout passionné de sucre.', 55.00, 30, '/uploads/ouvrage_1779168053280.jpg', 2, '2026-05-19 01:20:53', '2026-05-20 00:47:32'),
(25, 'L\'Escoffier Moderne', 'Paul Bocuse', '978-2-01-001001-1', 'Un hommage moderne au légendaire Auguste Escoffier, revisité par le grand Paul Bocuse. Ce classique de la cuisine française réunit les 500 recettes fondamentales de la gastronomie hexagonale : sauces mères, consommés, viandes braisées, poissons en croûte de sel, soufflés et entremets raffinés. Chaque recette est présentée avec ses variations contemporaines, permettant aux cuisiniers d\'aujourd\'hui d\'ancrer leur pratique dans une tradition séculaire tout en l\'adaptant aux goûts actuels. Un livre de chevet indispensable pour tout professionnel ou amateur sérieux de cuisine française.', 49.99, 20, '/uploads/ouvrage_1779168202363.jpg', 1, '2026-05-19 01:23:22', '2026-05-20 00:47:32'),
(26, 'Street Food du Monde', 'Lonely Planet', '978-2-81-610843-3', 'Partez à la découverte des saveurs du monde entier avec ce guide gourmand incontournable signé Lonely Planet. De la street food thaïlandaise aux tacos mexicains, en passant par les banh mi vietnamiens, les falafel libanais et les arepas colombiennes — 50 pays, 200 recettes authentiques, directement inspirées des marchés, ruelles et étals de rue. Chaque chapitre plonge dans la culture culinaire locale avec des anecdotes, des conseils de voyage et des astuces pour reproduire ces plats chez soi avec les ingrédients disponibles en épicerie. Un voyage culinaire sans frontières.', 32.00, 45, '/uploads/ouvrage_1779168269175.jpg', 3, '2026-05-19 01:24:29', '2026-05-20 00:47:32'),
(27, 'Végétarien au quotidien', 'Marie Laforêt', '978-2-81-420300-1', 'Marie Laforêt, pionnière de la cuisine végétale en France, signe ici un livre de référence pour adopter une alimentation végétarienne savoureuse et équilibrée au quotidien. Plus de 350 recettes créatives et accessibles, du petit-déjeuner au dessert, en passant par des dîners complets et des repas de fête. Des burgers de lentilles aux lasagnes aux légumes grillés, des currys de pois chiches aux tartes rustiques de saison — chaque recette prouve que cuisiner sans viande peut être généreux, festif et absolument délicieux. Avec des conseils nutritionnels et des substitutions pratiques.', 30.00, 12, '/uploads/ouvrage_1779168317943.jpg', 4, '2026-05-19 01:25:17', '2026-05-20 00:47:32'),
(28, 'Cuisine Express 30 min', 'Cyril Lignac', '978-2-01-500100-1', 'Le maître de la cuisine du quotidien, Cyril Lignac, partage ses 100 meilleures recettes réalisables en 30 minutes chrono sans sacrifier le goût ni la qualité. Des pâtes crémeuses au saumon fumé, des poulets rôtis express, des woks de légumes croquants, des soupes veloutées et des desserts rapides — chaque recette est conçue pour les soirs de semaine chargés où l\'on veut manger bien sans passer des heures en cuisine. Avec ses astuces de chef pour gagner du temps, ses conseils sur les ingrédients à toujours avoir dans son frigo et ses tours de main professionnels, ce livre change la vie.', 25.00, 66, '/uploads/ouvrage_1779168365593.jpg', 5, '2026-05-19 01:26:05', '2026-05-20 00:47:32');

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
(10, 13, 'stripe', 'pi_test_013', 'succeeded', 175.97, '2025-05-10 09:50:00'),
(11, 16, 'stripe', 'pi_test_016', 'succeeded', 84.00, '2026-05-15 09:05:00'),
(12, 17, 'stripe', 'pi_test_017', 'succeeded', 54.99, '2026-05-16 10:35:00'),
(13, 18, 'stripe', 'pi_test_018', 'succeeded', 112.00, '2026-05-17 11:05:00'),
(14, 21, 'stripe', 'pi_test_021', 'succeeded', 79.99, '2026-05-18 13:05:00'),
(15, 24, 'stripe', 'pi_test_024', 'succeeded', 49.99, '2026-05-19 08:05:00');

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
(1, 'Admin Principal', 'admin@livresgourmands.net', '$2b$10$htMj.adQzqb6AoBykBI2DOeLakwGm2.FRzeztN7hWPo7YG2OxxgSS', 'administrateur', 1, '2025-01-01 08:00:00', '2026-05-18 20:32:06'),
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
(13, 'Mohamed Nouaoury', 'mohamednouaoury2003@gmail.com', '$2b$10$nFc.2dXs3Lb11ZSp3IF4y.t4esfgk1zlfrYDmtup0po6gf1JyJ2ue', 'client', 1, '2026-05-14 16:01:37', '2026-05-14 16:01:37'),
(14, 'simo vines', 'simo@gmail.com', '$2b$10$htMj.adQzqb6AoBykBI2DOeLakwGm2.FRzeztN7hWPo7YG2OxxgSS', 'client', 1, '2026-05-18 20:31:45', '2026-05-18 20:31:45'),
(15, 'Test Runner', 'runner_1779249916986@test.com', '$2b$10$Qh7zfYXydYn.9mxHEdHTK.wSg5IHxtccmYSkPZNayhPAjaX5Hln7G', 'client', 1, '2026-05-20 00:05:17', '2026-05-20 00:05:17');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `commandes`
--
ALTER TABLE `commandes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `commande_items`
--
ALTER TABLE `commande_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `commentaires`
--
ALTER TABLE `commentaires`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `listes_cadeaux`
--
ALTER TABLE `listes_cadeaux`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `liste_items`
--
ALTER TABLE `liste_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `ouvrages`
--
ALTER TABLE `ouvrages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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
  ADD CONSTRAINT `fk_commande_items_ouvrage` FOREIGN KEY (`ouvrage_id`) REFERENCES `ouvrages` (`id`) ON DELETE SET NULL;

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
