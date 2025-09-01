/*==============================================================*/
/* Nom de SGBD :  Sybase SQL Anywhere 11                        */
/* Date de création :  01/09/2025 12:00:49                      */
/*==============================================================*/

if exists(select 1 from sys.sysforeignkey where role='FK_COMMANDE_COMMANDE_PRODUIT') then
    alter table Commande
       delete foreign key FK_COMMANDE_COMMANDE_PRODUIT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_COMMANDE_COMMANDE2_UTILISAT') then
    alter table Commande
       delete foreign key FK_COMMANDE_COMMANDE2_UTILISAT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_PANIER_AVOIR_UTILISAT') then
    alter table Panier
       delete foreign key FK_PANIER_AVOIR_UTILISAT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_PRODUIT_FABRIQUE_MARQUE') then
    alter table Produit
       delete foreign key FK_PRODUIT_FABRIQUE_MARQUE
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_PRODUIT_APPARTIEN_CATEGORI') then
    alter table Produit
       delete foreign key FK_PRODUIT_APPARTIEN_CATEGORI
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_STOCKER_STOCKER_PRODUIT') then
    alter table Stocker
       delete foreign key FK_STOCKER_STOCKER_PRODUIT
end if;

if exists(select 1 from sys.sysforeignkey where role='FK_STOCKER_STOCKER2_PANIER') then
    alter table Stocker
       delete foreign key FK_STOCKER_STOCKER2_PANIER
end if;

if exists(
   select 1 from sys.systable 
   where table_name='Categorie'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table Categorie
end if;

if exists(
   select 1 from sys.systable 
   where table_name='Commande'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table Commande
end if;

if exists(
   select 1 from sys.systable 
   where table_name='Marque'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table Marque
end if;

if exists(
   select 1 from sys.systable 
   where table_name='Panier'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table Panier
end if;

if exists(
   select 1 from sys.systable 
   where table_name='Produit'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table Produit
end if;

if exists(
   select 1 from sys.systable 
   where table_name='Stocker'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table Stocker
end if;

if exists(
   select 1 from sys.systable 
   where table_name='Utilisateurs'
     and table_type in ('BASE', 'GBL TEMP')
) then
    drop table Utilisateurs
end if;

/*==============================================================*/
/* Table : Categorie                                            */
/*==============================================================*/
create table Categorie 
(
   id_categorie         integer                        not null,
   nom                  varchar(20)                    null,
   constraint PK_CATEGORIE primary key (id_categorie)
);

/*==============================================================*/
/* Table : Commande                                             */
/*==============================================================*/
create table Commande 
(
   id_users             integer                        not null,
   id_produit           char(10)                       not null,
   quantite             integer                        null,
   prix                 decimal                        null,
   prix_total           decimal                        null,
   date_creation        timestamp                      null,
   statut               ENUM('en_attente','payée','expédiée') DEFAULT 'en_attente',
   constraint PK_COMMANDE primary key (id_users, id_produit)
);

/*==============================================================*/
/* Table : Marque                                               */
/*==============================================================*/
create table Marque 
(
   id_marque            integer                        not null,
   nom                  varchar(20)                    null,
   constraint PK_MARQUE primary key (id_marque)
);

/*==============================================================*/
/* Table : Panier                                               */
/*==============================================================*/
create table Panier 
(
   id_panier            integer                        not null,
   id_users             integer                        not null,
   date_creation        timestamp                      null,
   constraint PK_PANIER primary key (id_panier)
);

/*==============================================================*/
/* Table : Produit                                              */
/*==============================================================*/
create table Produit 
(
   id_produit           char(10)                       not null,
   id_categorie         integer                        not null,
   id_marque            integer                        not null,
   nom                  varchar(20)                    null,
   description          varchar(100)                   null,
   prix                 decimal                        null,
   stock                integer                        null,
   qr_code_path         varchar(100)                   null,
   date_creation        timestamp                      null,
   reste                integer                        null,
   constraint PK_PRODUIT primary key (id_produit)
);

/*==============================================================*/
/* Table : Stocker                                              */
/*==============================================================*/
create table Stocker 
(
   id_panier            integer                        not null,
   id_produit           char(10)                       not null,
   quantite             integer                        null,
   constraint PK_STOCKER primary key (id_panier, id_produit)
);

/*==============================================================*/
/* Table : Utilisateurs                                         */
/*==============================================================*/
create table Utilisateurs 
(
   id_users             integer                        not null,
   nom                  varchar(20)                    null,
   email                varchar(100)                   null,
   mdp_hash             varchar(50)                    null,
   date_creation        timestamp                      null,
   role                 ENUM('admin','client') DEFAULT 'client',
   constraint PK_UTILISATEURS primary key (id_users)
);

alter table Commande
   add constraint FK_COMMANDE_COMMANDE_PRODUIT foreign key (id_produit)
      references Produit (id_produit)
      on update restrict
      on delete restrict;

alter table Commande
   add constraint FK_COMMANDE_COMMANDE2_UTILISAT foreign key (id_users)
      references Utilisateurs (id_users)
      on update restrict
      on delete restrict;

alter table Panier
   add constraint FK_PANIER_AVOIR_UTILISAT foreign key (id_users)
      references Utilisateurs (id_users)
      on update restrict
      on delete restrict;

alter table Produit
   add constraint FK_PRODUIT_FABRIQUE_MARQUE foreign key (id_marque)
      references Marque (id_marque)
      on update restrict
      on delete restrict;

alter table Produit
   add constraint FK_PRODUIT_APPARTIEN_CATEGORI foreign key (id_categorie)
      references Categorie (id_categorie)
      on update restrict
      on delete restrict;

alter table Stocker
   add constraint FK_STOCKER_STOCKER_PRODUIT foreign key (id_produit)
      references Produit (id_produit)
      on update restrict
      on delete restrict;

alter table Stocker
   add constraint FK_STOCKER_STOCKER2_PANIER foreign key (id_panier)
      references Panier (id_panier)
      on update restrict
      on delete restrict;
