-- Script pour migrer id_produit de char(10) vers int auto-increment

-- 1. Supprimer les contraintes de clé étrangère
ALTER TABLE `commande` DROP FOREIGN KEY `FK_COMMANDE_PRODUIT`;
ALTER TABLE `stocker` DROP FOREIGN KEY `FK_STOCKER_PRODUIT`;

-- 2. Supprimer la clé primaire actuelle
ALTER TABLE `produit` DROP PRIMARY KEY;

-- 3. Modifier la colonne id_produit pour être un entier auto-increment
ALTER TABLE `produit` MODIFY COLUMN `id_produit` INT AUTO_INCREMENT PRIMARY KEY;

-- 4. Modifier les colonnes dans les tables de référence
ALTER TABLE `commande` MODIFY COLUMN `id_produit` INT;
ALTER TABLE `stocker` MODIFY COLUMN `id_produit` INT;

-- 5. Recréer les contraintes de clé étrangère
ALTER TABLE `commande` ADD CONSTRAINT `FK_COMMANDE_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;
ALTER TABLE `stocker` ADD CONSTRAINT `FK_STOCKER_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;

-- 6. Mettre à jour les données existantes (optionnel - pour garder les IDs existants)
-- UPDATE `produit` SET `id_produit` = CAST(SUBSTRING(`id_produit`, 2) AS UNSIGNED) WHERE `id_produit` LIKE 'P%';

