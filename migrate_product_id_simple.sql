-- Script de migration simple - supprime toutes les contraintes sans spécifier les noms

-- 1. Désactiver les vérifications de clés étrangères temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Supprimer toutes les contraintes de clé étrangère de la table produit
-- (MySQL supprimera automatiquement les contraintes qui n'existent pas)
SET @sql = (SELECT CONCAT('ALTER TABLE produit DROP FOREIGN KEY ', CONSTRAINT_NAME, ';') 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = 'catalogue' 
            AND TABLE_NAME = 'produit' 
            AND CONSTRAINT_NAME != 'PRIMARY'
            LIMIT 1);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 3. Supprimer toutes les contraintes de clé étrangère de la table commande
SET @sql = (SELECT CONCAT('ALTER TABLE commande DROP FOREIGN KEY ', CONSTRAINT_NAME, ';') 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = 'catalogue' 
            AND TABLE_NAME = 'commande' 
            AND CONSTRAINT_NAME != 'PRIMARY'
            LIMIT 1);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 4. Supprimer toutes les contraintes de clé étrangère de la table stocker
SET @sql = (SELECT CONCAT('ALTER TABLE stocker DROP FOREIGN KEY ', CONSTRAINT_NAME, ';') 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = 'catalogue' 
            AND TABLE_NAME = 'stocker' 
            AND CONSTRAINT_NAME != 'PRIMARY'
            LIMIT 1);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 5. Supprimer la clé primaire actuelle
ALTER TABLE `produit` DROP PRIMARY KEY;

-- 6. Modifier la colonne `id_produit` dans la table `produit`
ALTER TABLE `produit`
    MODIFY `id_produit` INT(11) NOT NULL AUTO_INCREMENT;

-- 7. Modifier la colonne `id_produit` dans la table `commande`
ALTER TABLE `commande`
    MODIFY `id_produit` INT(11) NOT NULL;

-- 8. Modifier la colonne `id_produit` dans la table `stocker`
ALTER TABLE `stocker`
    MODIFY `id_produit` INT(11) NOT NULL;

-- 9. Recréer la clé primaire
ALTER TABLE `produit`
    ADD PRIMARY KEY (`id_produit`);

-- 10. Ré-ajouter les contraintes de clé étrangère
ALTER TABLE `produit`
    ADD CONSTRAINT `FK_PRODUIT_CATEGORIE` FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`) ON UPDATE CASCADE,
    ADD CONSTRAINT `FK_PRODUIT_MARQUE` FOREIGN KEY (`id_marque`) REFERENCES `marque` (`id_marque`) ON UPDATE CASCADE;

ALTER TABLE `commande`
    ADD CONSTRAINT `FK_COMMANDE_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;

ALTER TABLE `stocker`
    ADD CONSTRAINT `FK_STOCKER_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;

-- 11. Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;


