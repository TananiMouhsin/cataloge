-- Script pour recréer les tables avec la bonne structure
-- Ce script supprime et recrée les tables avec id_produit en INT

-- 1. Désactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Supprimer les tables dans l'ordre des dépendances
DROP TABLE IF EXISTS `commande`;
DROP TABLE IF EXISTS `stocker`;
DROP TABLE IF EXISTS `produit`;
DROP TABLE IF EXISTS `categorie`;
DROP TABLE IF EXISTS `marque`;

-- 3. Recréer la table categorie
CREATE TABLE `categorie` (
  `id_categorie` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_categorie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Recréer la table marque
CREATE TABLE `marque` (
  `id_marque` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_marque`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Recréer la table produit avec id_produit en INT
CREATE TABLE `produit` (
  `id_produit` int(11) NOT NULL AUTO_INCREMENT,
  `id_categorie` int(11) NOT NULL,
  `id_marque` int(11) NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `prix` decimal(10,2) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `qr_code_path` varchar(255) DEFAULT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `reste` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_produit`),
  KEY `FK_PRODUIT_CATEGORIE` (`id_categorie`),
  KEY `FK_PRODUIT_MARQUE` (`id_marque`),
  CONSTRAINT `FK_PRODUIT_CATEGORIE` FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`) ON UPDATE CASCADE,
  CONSTRAINT `FK_PRODUIT_MARQUE` FOREIGN KEY (`id_marque`) REFERENCES `marque` (`id_marque`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Recréer la table commande
CREATE TABLE `commande` (
  `id_commande` int(11) NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `quantite` int(11) DEFAULT NULL,
  `prix_unitaire` decimal(10,2) DEFAULT NULL,
  `date_commande` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_commande`),
  KEY `FK_COMMANDE_PRODUIT` (`id_produit`),
  CONSTRAINT `FK_COMMANDE_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Recréer la table stocker
CREATE TABLE `stocker` (
  `id_stocker` int(11) NOT NULL AUTO_INCREMENT,
  `id_produit` int(11) NOT NULL,
  `quantite_stock` int(11) DEFAULT NULL,
  `date_mise_a_jour` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_stocker`),
  KEY `FK_STOCKER_PRODUIT` (`id_produit`),
  CONSTRAINT `FK_STOCKER_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;


