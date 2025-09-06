/*==============================================================*/
/* Base de données Catalogue Digital - Compatible MySQL          */
/*==============================================================*/

-- =====================
-- Suppression des tables (les contraintes sont supprimées automatiquement)
-- =====================
DROP TABLE IF EXISTS Stocker;
DROP TABLE IF EXISTS Commande;
DROP TABLE IF EXISTS Panier;
DROP TABLE IF EXISTS Produit;
DROP TABLE IF EXISTS Marque;
DROP TABLE IF EXISTS Categorie;
DROP TABLE IF EXISTS Utilisateurs;

-- =====================
-- Création des tables
-- =====================

/* Table : Categorie */
CREATE TABLE Categorie (
   id_categorie INT NOT NULL AUTO_INCREMENT,
   nom          VARCHAR(50),
   CONSTRAINT PK_CATEGORIE PRIMARY KEY (id_categorie)
) ENGINE=InnoDB;

/* Table : Utilisateurs */
CREATE TABLE Utilisateurs (
   id_users      INT NOT NULL AUTO_INCREMENT,
   nom           VARCHAR(50),
   email         VARCHAR(100),
   mdp_hash      VARCHAR(255),
   date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   role          ENUM('admin','client') DEFAULT 'client',
   CONSTRAINT PK_UTILISATEURS PRIMARY KEY (id_users)
) ENGINE=InnoDB;

/* Table : Marque */
CREATE TABLE Marque (
   id_marque INT NOT NULL AUTO_INCREMENT,
   nom       VARCHAR(50),
   CONSTRAINT PK_MARQUE PRIMARY KEY (id_marque)
) ENGINE=InnoDB;

/* Table : Produit */
CREATE TABLE Produit (
   id_produit   CHAR(10) NOT NULL,
   id_categorie INT NOT NULL,
   id_marque    INT NOT NULL,
   nom          VARCHAR(100),
   description  VARCHAR(255),
   prix         DECIMAL(10,2),
   stock        INT,
   qr_code_path VARCHAR(255),
   date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   reste        INT,
   CONSTRAINT PK_PRODUIT PRIMARY KEY (id_produit)
) ENGINE=InnoDB;

/* Table : Panier */
CREATE TABLE Panier (
   id_panier     INT NOT NULL AUTO_INCREMENT,
   id_users      INT NOT NULL,
   date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT PK_PANIER PRIMARY KEY (id_panier)
) ENGINE=InnoDB;

/* Table : Commande */
CREATE TABLE Commande (
   id_users      INT NOT NULL,
   id_produit    CHAR(10) NOT NULL,
   quantite      INT,
   prix          DECIMAL(10,2),
   prix_total    DECIMAL(10,2),
   date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   statut        ENUM('en_attente','payée','expédiée') DEFAULT 'en_attente',
   CONSTRAINT PK_COMMANDE PRIMARY KEY (id_users, id_produit)
) ENGINE=InnoDB;

/* Table : Stocker */
CREATE TABLE Stocker (
   id_panier  INT NOT NULL,
   id_produit CHAR(10) NOT NULL,
   quantite   INT,
   CONSTRAINT PK_STOCKER PRIMARY KEY (id_panier, id_produit)
) ENGINE=InnoDB;

-- =====================
-- Ajout des clés étrangères
-- =====================
ALTER TABLE Commande
   ADD CONSTRAINT FK_COMMANDE_PRODUIT FOREIGN KEY (id_produit)
      REFERENCES Produit (id_produit)
      ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE Commande
   ADD CONSTRAINT FK_COMMANDE_UTILISATEUR FOREIGN KEY (id_users)
      REFERENCES Utilisateurs (id_users)
      ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE Panier
   ADD CONSTRAINT FK_PANIER_UTILISATEUR FOREIGN KEY (id_users)
      REFERENCES Utilisateurs (id_users)
      ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE Produit
   ADD CONSTRAINT FK_PRODUIT_MARQUE FOREIGN KEY (id_marque)
      REFERENCES Marque (id_marque)
      ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE Produit
   ADD CONSTRAINT FK_PRODUIT_CATEGORIE FOREIGN KEY (id_categorie)
      REFERENCES Categorie (id_categorie)
      ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE Stocker
   ADD CONSTRAINT FK_STOCKER_PRODUIT FOREIGN KEY (id_produit)
      REFERENCES Produit (id_produit)
      ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE Stocker
   ADD CONSTRAINT FK_STOCKER_PANIER FOREIGN KEY (id_panier)
      REFERENCES Panier (id_panier)
      ON UPDATE CASCADE ON DELETE RESTRICT;
