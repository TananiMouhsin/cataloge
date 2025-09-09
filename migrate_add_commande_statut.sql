-- Migration: add statut column to Commande
-- Usage (SQLite):
--   sqlite3 catalogue.db < migrate_add_commande_statut.sql

BEGIN TRANSACTION;

ALTER TABLE Commande ADD COLUMN statut TEXT NOT NULL DEFAULT 'Pending';

COMMIT;
