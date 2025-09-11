-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : jeu. 11 sep. 2025 à 20:06
-- Version du serveur : 10.4.28-MariaDB
-- Version de PHP : 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `catalogue`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id_categorie` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id_categorie`, `nom`, `description`) VALUES
(9, 'Électronique', NULL),
(10, 'Livres', NULL),
(11, 'Vêtements', NULL),
(12, 'Sport', NULL),
(13, 'Maison', NULL),
(14, 'GAMGHALINHOO', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

CREATE TABLE `commande` (
  `id_commande` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `quantite` int(11) DEFAULT NULL,
  `prix_unitaire` decimal(10,2) DEFAULT NULL,
  `date_commande` timestamp NOT NULL DEFAULT current_timestamp(),
  `statut` text NOT NULL DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commande`
--

INSERT INTO `commande` (`id_commande`, `id_users`, `id_produit`, `quantite`, `prix_unitaire`, `date_commande`, `statut`) VALUES
(28, 11, 49, 1, 100.00, '2025-09-10 21:15:40', 'pending'),
(29, 11, 50, 2, 50.00, '2025-09-10 21:15:40', 'pending'),
(30, 4, 49, 1, NULL, '2025-09-11 12:35:36', 'en_attente'),
(31, 4, 50, 1, NULL, '2025-09-11 12:35:36', 'en_attente'),
(32, 4, 50, 1, 50.00, '2025-09-11 16:39:25', 'pending'),
(33, 12, 49, 1, 100.00, '2025-09-11 16:44:43', 'pending'),
(34, 12, 49, 1, 100.00, '2025-09-11 16:55:57', 'pending');

-- --------------------------------------------------------

--
-- Structure de la table `marque`
--

CREATE TABLE `marque` (
  `id_marque` int(11) NOT NULL,
  `nom` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `marque`
--

INSERT INTO `marque` (`id_marque`, `nom`, `description`) VALUES
(8, 'Apple', NULL),
(9, 'Sony', NULL),
(10, 'Samsung', NULL),
(11, 'Nike', NULL),
(12, 'Adidas', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `panier`
--

CREATE TABLE `panier` (
  `id_panier` int(11) NOT NULL,
  `id_users` int(11) NOT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `panier`
--

INSERT INTO `panier` (`id_panier`, `id_users`, `date_creation`) VALUES
(2, 7, '2025-09-08 15:45:55'),
(4, 8, '2025-09-09 11:33:42'),
(21, 11, '2025-09-10 21:15:33'),
(23, 4, '2025-09-11 16:39:25'),
(24, 12, '2025-09-11 16:44:40');

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

CREATE TABLE `produit` (
  `id_produit` int(11) NOT NULL,
  `id_categorie` int(11) NOT NULL,
  `id_marque` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `prix` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `qr_code_path` varchar(255) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `reste` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`id_produit`, `id_categorie`, `id_marque`, `nom`, `description`, `prix`, `stock`, `qr_code_path`, `date_creation`, `reste`) VALUES
(49, 12, 11, 'neymar', 'MEE', 100.00, 8, 'blob:http://localhost:5173/c7fb8968-a1b2-45b6-a1aa-c858b5fe6ad3', '2025-09-10 22:07:26', NULL),
(50, 12, 8, 'pedri', 'MIDFILDER', 50.00, 7, 'blob:http://localhost:5173/54e7411a-b717-41e6-9344-c2e96db7d045', '2025-09-10 22:08:15', NULL),
(51, 14, 10, 'GAMGHALINHO', 'LEOOO', 9999.00, 20, 'blob:http://localhost:5173/e6d90fac-62d6-450e-954f-ec56bfbbc711', '2025-09-11 13:54:19', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `stocker`
--

CREATE TABLE `stocker` (
  `id_stocker` int(11) NOT NULL,
  `id_panier` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `quantite_stock` int(11) DEFAULT NULL,
  `date_mise_a_jour` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id_users` int(11) NOT NULL,
  `nom` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mdp_hash` varchar(255) DEFAULT NULL,
  `date_creation` timestamp NOT NULL DEFAULT current_timestamp(),
  `role` enum('admin','client') DEFAULT 'client'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id_users`, `nom`, `email`, `mdp_hash`, `date_creation`, `role`) VALUES
(1, 'othmane', 'othmanegamghal@gmail.com', '$2b$12$JuGSN27kUc0MDQM2myuFzeQSiyvmg7PrEyFOR8YG2j27/b/0E78J6', '2025-09-02 14:46:27', 'admin'),
(3, 'OTHAMNE GAMGHAL', 'othmane@gmail.com', '$2b$12$dKdF7Z2gtAeZVEBy9EiOVe4lDCWDNc8hwlCo1r1CI0rNyTbGY/Mhm', '2025-09-06 14:35:21', 'client'),
(4, 'OTHAMNE GAMGHAL', 'pedri@gmail.com', '$2b$12$efxUF1c2Tx6tec6GV0Zfa.FRYPMZ9YNRdDiNKuQx8q5YOB.PWc69G', '2025-09-06 14:53:18', 'client'),
(5, 'pedri pedri', 'leo@gmail.com', '$2b$12$zOwOlHOYNNriyRFAESpMC.kBjPDYLIQYw5eVSWU84J6KvgbNVpgIm', '2025-09-08 12:12:43', 'client'),
(6, 'Admin', 'admin@example.com', '$2b$12$syKbe7CNM6/JSWJYcgPxB.sS4nNWW//sixRyCWvhSj9.ql0hLV9LW', '2025-09-08 12:18:25', 'admin'),
(7, 'gavi gavi', 'gavi@gmail.com', '$2b$12$JPwwQWOrb8/efqO9F56oo.AKExTB.HrCLJ7eQ4drlAMVTPYjFirG2', '2025-09-08 12:24:02', 'client'),
(8, 'messi leo', 'messi@gmail.com', '$2b$12$ThlcjFksYFVyrXrlKwbc9uk4Y9Lblq2wNL2zvccRxMNbBSvwgNAbC', '2025-09-08 16:05:34', 'admin'),
(9, 'othmane othmane', 'oth@gmail.com', '$2b$12$Slw/jZUDWD9geFGeyAs.LOpsboSJvVcda1QRrKZpWD7DIkWGvE2D.', '2025-09-10 20:05:50', 'client'),
(10, 'Test User', 'testuser@example.com', '$2b$12$lfdzJKTlpla/KfqoJMVWwu0LTmIFYObzgRPRVifxomE80onBbFXmy', '2025-09-10 22:15:07', 'client'),
(11, 'Test User', 'test1757542524@example.com', '$2b$12$gW/JJP3rF6NxZhwngzpikOxjre8IizLuyLlT7bd.So5mWNS0UjeTi', '2025-09-10 22:15:29', 'client'),
(12, 'Test User', 'test@example.com', '$2b$12$AQxld349f6YB7jpomUsQVetlxSkQhBpyUFpZ587VcZmXjsiVdx.EG', '2025-09-11 17:43:15', 'client');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id_categorie`);

--
-- Index pour la table `commande`
--
ALTER TABLE `commande`
  ADD PRIMARY KEY (`id_commande`),
  ADD KEY `FK_COMMANDE_PRODUIT` (`id_produit`),
  ADD KEY `FK_COMMANDE_UTILISATEURS` (`id_users`);

--
-- Index pour la table `marque`
--
ALTER TABLE `marque`
  ADD PRIMARY KEY (`id_marque`);

--
-- Index pour la table `panier`
--
ALTER TABLE `panier`
  ADD PRIMARY KEY (`id_panier`),
  ADD KEY `FK_PANIER_UTILISATEUR` (`id_users`);

--
-- Index pour la table `produit`
--
ALTER TABLE `produit`
  ADD PRIMARY KEY (`id_produit`),
  ADD KEY `FK_PRODUIT_CATEGORIE` (`id_categorie`),
  ADD KEY `FK_PRODUIT_MARQUE` (`id_marque`);

--
-- Index pour la table `stocker`
--
ALTER TABLE `stocker`
  ADD PRIMARY KEY (`id_stocker`),
  ADD KEY `FK_STOCKER_PRODUIT` (`id_produit`),
  ADD KEY `IDX_STOCKER_PANIER` (`id_panier`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id_users`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id_categorie` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `commande`
--
ALTER TABLE `commande`
  MODIFY `id_commande` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT pour la table `marque`
--
ALTER TABLE `marque`
  MODIFY `id_marque` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `panier`
--
ALTER TABLE `panier`
  MODIFY `id_panier` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `produit`
--
ALTER TABLE `produit`
  MODIFY `id_produit` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT pour la table `stocker`
--
ALTER TABLE `stocker`
  MODIFY `id_stocker` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id_users` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commande`
--
ALTER TABLE `commande`
  ADD CONSTRAINT `FK_COMMANDE_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_COMMANDE_UTILISATEURS` FOREIGN KEY (`id_users`) REFERENCES `utilisateurs` (`id_users`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `panier`
--
ALTER TABLE `panier`
  ADD CONSTRAINT `FK_PANIER_UTILISATEUR` FOREIGN KEY (`id_users`) REFERENCES `utilisateurs` (`id_users`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `produit`
--
ALTER TABLE `produit`
  ADD CONSTRAINT `FK_PRODUIT_CATEGORIE` FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_PRODUIT_MARQUE` FOREIGN KEY (`id_marque`) REFERENCES `marque` (`id_marque`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `stocker`
--
ALTER TABLE `stocker`
  ADD CONSTRAINT `FK_STOCKER_PANIER` FOREIGN KEY (`id_panier`) REFERENCES `panier` (`id_panier`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_STOCKER_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
