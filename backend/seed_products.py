#!/usr/bin/env python3
"""
Script pour insérer des produits dans la base de données MySQL
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import Produit, Categorie, Marque
from sqlalchemy.orm import Session

def create_sample_data():
    db = SessionLocal()
    
    try:
        # Vérifier si des catégories existent
        categories = db.query(Categorie).all()
        if not categories:
            print("Création des catégories...")
            categories_data = [
                {"nom": "Smartphones", "description": "Téléphones intelligents"},
                {"nom": "Laptops", "description": "Ordinateurs portables"},
                {"nom": "Tablettes", "description": "Tablettes tactiles"},
                {"nom": "Accessoires", "description": "Accessoires électroniques"}
            ]
            for cat_data in categories_data:
                categorie = Categorie(**cat_data)
                db.add(categorie)
            db.commit()
            print("Catégories créées avec succès")
        
        # Vérifier si des marques existent
        marques = db.query(Marque).all()
        if not marques:
            print("Création des marques...")
            marques_data = [
                {"nom": "Apple", "description": "Marque américaine"},
                {"nom": "Samsung", "description": "Marque coréenne"},
                {"nom": "Dell", "description": "Marque américaine"},
                {"nom": "HP", "description": "Marque américaine"}
            ]
            for marque_data in marques_data:
                marque = Marque(**marque_data)
                db.add(marque)
            db.commit()
            print("Marques créées avec succès")
        
        # Récupérer les catégories et marques
        categories = db.query(Categorie).all()
        marques = db.query(Marque).all()
        
        # Vérifier si des produits existent déjà
        existing_products = db.query(Produit).count()
        if existing_products > 0:
            print(f"Il y a déjà {existing_products} produits dans la base de données")
            return
        
        print("Création des produits...")
        
        # Données des produits
        produits_data = [
            {
                "nom": "iPhone 15 Pro",
                "description": "Dernier iPhone avec puce A17 Pro et caméra 48MP",
                "prix": 1199.99,
                "stock": 25,
                "categorie_id": categories[0].id_categorie,  # Smartphones
                "marque_id": marques[0].id_marque,  # Apple
                "image_url": "https://example.com/iphone15pro.jpg"
            },
            {
                "nom": "Samsung Galaxy S24",
                "description": "Smartphone Android haut de gamme avec IA",
                "prix": 999.99,
                "stock": 30,
                "categorie_id": categories[0].id_categorie,  # Smartphones
                "marque_id": marques[1].id_marque,  # Samsung
                "image_url": "https://example.com/galaxy-s24.jpg"
            },
            {
                "nom": "MacBook Pro 16\"",
                "description": "Laptop professionnel avec puce M3 Max",
                "prix": 2499.99,
                "stock": 15,
                "categorie_id": categories[1].id_categorie,  # Laptops
                "marque_id": marques[0].id_marque,  # Apple
                "image_url": "https://example.com/macbook-pro-16.jpg"
            },
            {
                "nom": "Dell XPS 15",
                "description": "Laptop ultraportable avec écran 4K",
                "prix": 1799.99,
                "stock": 20,
                "categorie_id": categories[1].id_categorie,  # Laptops
                "marque_id": marques[2].id_marque,  # Dell
                "image_url": "https://example.com/dell-xps-15.jpg"
            },
            {
                "nom": "iPad Pro 12.9\"",
                "description": "Tablette professionnelle avec puce M2",
                "prix": 1099.99,
                "stock": 18,
                "categorie_id": categories[2].id_categorie,  # Tablettes
                "marque_id": marques[0].id_marque,  # Apple
                "image_url": "https://example.com/ipad-pro-12-9.jpg"
            },
            {
                "nom": "Samsung Galaxy Tab S9",
                "description": "Tablette Android avec écran AMOLED",
                "prix": 799.99,
                "stock": 22,
                "categorie_id": categories[2].id_categorie,  # Tablettes
                "marque_id": marques[1].id_marque,  # Samsung
                "image_url": "https://example.com/galaxy-tab-s9.jpg"
            },
            {
                "nom": "AirPods Pro 2",
                "description": "Écouteurs sans fil avec réduction de bruit",
                "prix": 249.99,
                "stock": 50,
                "categorie_id": categories[3].id_categorie,  # Accessoires
                "marque_id": marques[0].id_marque,  # Apple
                "image_url": "https://example.com/airpods-pro-2.jpg"
            },
            {
                "nom": "Samsung Galaxy Buds2 Pro",
                "description": "Écouteurs sans fil avec qualité audio premium",
                "prix": 199.99,
                "stock": 40,
                "categorie_id": categories[3].id_categorie,  # Accessoires
                "marque_id": marques[1].id_marque,  # Samsung
                "image_url": "https://example.com/galaxy-buds2-pro.jpg"
            }
        ]
        
        # Insérer les produits
        for produit_data in produits_data:
            produit = Produit(**produit_data)
            db.add(produit)
        
        db.commit()
        print(f"{len(produits_data)} produits créés avec succès")
        
        # Afficher un résumé
        print("\nRésumé:")
        print(f"- Catégories: {len(categories)}")
        print(f"- Marques: {len(marques)}")
        print(f"- Produits: {len(produits_data)}")
        
    except Exception as e:
        print(f"Erreur lors de l'insertion: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Démarrage de l'insertion des données...")
    create_sample_data()
    print("Terminé!")
