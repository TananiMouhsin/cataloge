-- Script pour vérifier les contraintes existantes
-- Exécutez ceci d'abord pour voir les noms réels des contraintes

-- Vérifier les contraintes de la table produit
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE 
    TABLE_SCHEMA = 'catalogue' 
    AND TABLE_NAME = 'produit'
    AND CONSTRAINT_NAME != 'PRIMARY';

-- Vérifier les contraintes de la table commande
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE 
    TABLE_SCHEMA = 'catalogue' 
    AND TABLE_NAME = 'commande'
    AND CONSTRAINT_NAME != 'PRIMARY';

-- Vérifier les contraintes de la table stocker
SELECT 
    CONSTRAINT_NAME,
    TABLE_NAME,
    COLUMN_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM 
    INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
WHERE 
    TABLE_SCHEMA = 'catalogue' 
    AND TABLE_NAME = 'stocker'
    AND CONSTRAINT_NAME != 'PRIMARY';











