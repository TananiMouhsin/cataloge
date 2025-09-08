-- Script de migration sécurisé pour id_produit
-- Ce script gère le cas où il y a déjà un champ auto-increment

-- 1. Désactiver les vérifications de clés étrangères temporairement
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Supprimer les contraintes de clé étrangère existantes sur `produit`
ALTER TABLE `produit` DROP FOREIGN KEY `FK_PRODUIT_CATEGORIE`;
ALTER TABLE `produit` DROP FOREIGN KEY `FK_PRODUIT_MARQUE`;

-- 3. Supprimer les contraintes de clé étrangère existantes sur `commande` et `stocker`
ALTER TABLE `commande` DROP FOREIGN KEY `FK_COMMANDE_PRODUIT`;
ALTER TABLE `stocker` DROP FOREIGN KEY `FK_STOCKER_PRODUIT`;

-- 4. Supprimer la clé primaire actuelle
ALTER TABLE `produit` DROP PRIMARY KEY;

-- 5. Modifier la colonne `id_produit` dans la table `produit`
ALTER TABLE `produit`
    MODIFY `id_produit` INT(11) NOT NULL AUTO_INCREMENT;

-- 6. Modifier la colonne `id_produit` dans la table `commande`
ALTER TABLE `commande`
    MODIFY `id_produit` INT(11) NOT NULL;

-- 7. Modifier la colonne `id_produit` dans la table `stocker`
ALTER TABLE `stocker`
    MODIFY `id_produit` INT(11) NOT NULL;

-- 8. Recréer la clé primaire
ALTER TABLE `produit`
    ADD PRIMARY KEY (`id_produit`);

-- 9. Ré-ajouter les contraintes de clé étrangère
ALTER TABLE `produit`
    ADD CONSTRAINT `FK_PRODUIT_CATEGORIE` FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`) ON UPDATE CASCADE,
    ADD CONSTRAINT `FK_PRODUIT_MARQUE` FOREIGN KEY (`id_marque`) REFERENCES `marque` (`id_marque`) ON UPDATE CASCADE;

ALTER TABLE `commande`
    ADD CONSTRAINT `FK_COMMANDE_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;

ALTER TABLE `stocker`
    ADD CONSTRAINT `FK_STOCKER_PRODUIT` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`) ON UPDATE CASCADE;

-- 10. Réactiver les vérifications de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

