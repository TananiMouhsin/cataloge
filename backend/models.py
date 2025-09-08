from sqlalchemy import Column, Integer, String, Enum, ForeignKey, DECIMAL, TIMESTAMP
from sqlalchemy.orm import relationship
from .database import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    client = "client"


class Categorie(Base):
    __tablename__ = "Categorie"

    id_categorie = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(50))

    produits = relationship("Produit", back_populates="categorie")


class Marque(Base):
    __tablename__ = "Marque"

    id_marque = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(50))

    produits = relationship("Produit", back_populates="marque")


class Utilisateurs(Base):
    __tablename__ = "Utilisateurs"

    id_users = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(50))
    email = Column(String(100), unique=True, index=True)
    mdp_hash = Column(String(255))
    date_creation = Column(TIMESTAMP)
    role = Column(Enum(UserRole), default=UserRole.client)


class Produit(Base):
    __tablename__ = "Produit"

    id_produit = Column(Integer, primary_key=True, autoincrement=True)
    id_categorie = Column(Integer, ForeignKey("Categorie.id_categorie"), nullable=False)
    id_marque = Column(Integer, ForeignKey("Marque.id_marque"), nullable=False)
    nom = Column(String(100))
    description = Column(String(255))
    prix = Column(DECIMAL(10, 2))
    stock = Column(Integer)
    qr_code_path = Column(String(255))
    date_creation = Column(TIMESTAMP)
    reste = Column(Integer)

    categorie = relationship("Categorie", back_populates="produits")
    marque = relationship("Marque", back_populates="produits")


class Panier(Base):
    __tablename__ = "Panier"

    id_panier = Column(Integer, primary_key=True, autoincrement=True)
    id_users = Column(Integer, ForeignKey("Utilisateurs.id_users"), nullable=False)
    date_creation = Column(TIMESTAMP)


class Commande(Base):
    __tablename__ = "Commande"

    id_commande = Column(Integer, primary_key=True, autoincrement=True)
    id_users = Column(Integer, ForeignKey("Utilisateurs.id_users"), nullable=False)
    id_produit = Column(Integer, ForeignKey("Produit.id_produit"), nullable=False)
    quantite = Column(Integer)
    prix_unitaire = Column(DECIMAL(10, 2))
    date_commande = Column(TIMESTAMP)


    


class Stocker(Base):
    __tablename__ = "Stocker"

    id_stocker = Column(Integer, primary_key=True, autoincrement=True)
    id_panier = Column(Integer, ForeignKey("Panier.id_panier"), index=True)
    id_produit = Column(Integer, ForeignKey("Produit.id_produit"))
    quantite_stock = Column(Integer)
    date_mise_a_jour = Column(TIMESTAMP)



    

