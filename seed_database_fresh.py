#!/usr/bin/env python3
"""
Script pour insérer des données fraîches avec des IDs entiers
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import SessionLocal
from backend.models import Categorie, Marque, Produit, Commande, Stocker

def clean_and_seed():
    """Nettoyer et insérer les données"""
    db = SessionLocal()
    
    try:
        print("Nettoyage des données existantes...")
        
        # Supprimer dans l'ordre des dépendances
        db.query(Commande).delete()
        db.query(Stocker).delete()
        db.query(Produit).delete()
        db.query(Categorie).delete()
        db.query(Marque).delete()
        
        db.commit()
        print("✓ Données supprimées")
        
        # Créer les catégories
        print("\nCréation des catégories...")
        categories_data = [
            "Électronique",
            "Livres", 
            "Vêtements",
            "Sport",
            "Maison"
        ]
        
        for category_name in categories_data:
            category = Categorie(nom=category_name)
            db.add(category)
            print(f"✓ Catégorie '{category_name}' créée")
        
        db.commit()
        
        # Créer les marques
        print("\nCréation des marques...")
        brands_data = [
            "Apple",
            "Sony", 
            "Samsung",
            "Nike",
            "Adidas"
        ]
        
        for brand_name in brands_data:
            brand = Marque(nom=brand_name)
            db.add(brand)
            print(f"✓ Marque '{brand_name}' créée")
        
        db.commit()
        
        # Créer les produits
        print("\nCréation des produits...")
        products_data = [
            # Électronique
            {"id_categorie": 1, "id_marque": 1, "nom": "iPhone 15 Pro", "description": "Dernier iPhone avec puce A17 Pro, caméra 48MP", "prix": 1199.99, "stock": 25, "qr_code_path": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", "reste": 25},
            {"id_categorie": 1, "id_marque": 2, "nom": "Sony WH-1000XM5", "description": "Casque sans fil avec réduction de bruit", "prix": 399.99, "stock": 35, "qr_code_path": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500", "reste": 35},
            {"id_categorie": 1, "id_marque": 3, "nom": "Samsung Galaxy S24", "description": "Smartphone Android haut de gamme", "prix": 999.99, "stock": 30, "qr_code_path": "https://images.unsplash.com/photo-1511707171631-9ed0a0b2b65d?w=500", "reste": 30},
            {"id_categorie": 1, "id_marque": 1, "nom": "MacBook Pro 16\"", "description": "Laptop professionnel avec puce M3 Max", "prix": 3499.99, "stock": 15, "qr_code_path": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500", "reste": 15},
            {"id_categorie": 1, "id_marque": 2, "nom": "Sony PlayStation 5", "description": "Console de jeu nouvelle génération", "prix": 499.99, "stock": 20, "qr_code_path": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500", "reste": 20},
            
            # Livres
            {"id_categorie": 2, "id_marque": 1, "nom": "MacBook Pro Guide", "description": "Guide complet pour MacBook Pro", "prix": 29.99, "stock": 50, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", "reste": 50},
            {"id_categorie": 2, "id_marque": 2, "nom": "Sony Camera Manual", "description": "Manuel d'utilisation appareil photo Sony", "prix": 19.99, "stock": 40, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", "reste": 40},
            {"id_categorie": 2, "id_marque": 3, "nom": "Samsung Galaxy Guide", "description": "Guide utilisateur Samsung Galaxy", "prix": 24.99, "stock": 45, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", "reste": 45},
            
            # Vêtements
            {"id_categorie": 3, "id_marque": 4, "nom": "Nike Air Max 270", "description": "Chaussures de sport Nike Air Max", "prix": 149.99, "stock": 60, "qr_code_path": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", "reste": 60},
            {"id_categorie": 3, "id_marque": 5, "nom": "Adidas Ultraboost 22", "description": "Chaussures de course Adidas", "prix": 179.99, "stock": 55, "qr_code_path": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", "reste": 55},
            {"id_categorie": 3, "id_marque": 4, "nom": "Nike Dri-FIT T-Shirt", "description": "T-shirt de sport Nike", "prix": 29.99, "stock": 80, "qr_code_path": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", "reste": 80},
            {"id_categorie": 3, "id_marque": 5, "nom": "Adidas Originals Hoodie", "description": "Sweat à capuche Adidas", "prix": 79.99, "stock": 40, "qr_code_path": "https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=500", "reste": 40},
            
            # Sport
            {"id_categorie": 4, "id_marque": 4, "nom": "Nike Basketball", "description": "Ballon de basket Nike", "prix": 39.99, "stock": 25, "qr_code_path": "https://images.unsplash.com/photo-1546519638-68e109f0c7c8?w=500", "reste": 25},
            {"id_categorie": 4, "id_marque": 5, "nom": "Adidas Football", "description": "Ballon de football Adidas", "prix": 49.99, "stock": 30, "qr_code_path": "https://images.unsplash.com/photo-1546519638-68e109f0c7c8?w=500", "reste": 30},
            {"id_categorie": 4, "id_marque": 4, "nom": "Nike Yoga Mat", "description": "Tapis de yoga Nike", "prix": 59.99, "stock": 35, "qr_code_path": "https://images.unsplash.com/photo-1506629905607-4b2b4b2b2b2b?w=500", "reste": 35},
            
            # Maison
            {"id_categorie": 5, "id_marque": 1, "nom": "Apple HomePod mini", "description": "Enceinte intelligente Apple", "prix": 99.99, "stock": 20, "qr_code_path": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500", "reste": 20},
            {"id_categorie": 5, "id_marque": 2, "nom": "Sony Soundbar", "description": "Barre de son Sony pour TV", "prix": 299.99, "stock": 15, "qr_code_path": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500", "reste": 15},
            {"id_categorie": 5, "id_marque": 3, "nom": "Samsung Smart TV 55\"", "description": "Télévision intelligente Samsung", "prix": 899.99, "stock": 10, "qr_code_path": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", "reste": 10}
        ]
        
        for product_data in products_data:
            product = Produit(**product_data)
            db.add(product)
            print(f"✓ Produit '{product_data['nom']}' créé")
        
        db.commit()
        
        # Vérification finale
        print("\n=== Vérification finale ===")
        categories_count = db.query(Categorie).count()
        brands_count = db.query(Marque).count()
        products_count = db.query(Produit).count()
        
        print(f"Catégories: {categories_count}")
        print(f"Marques: {brands_count}")
        print(f"Produits: {products_count}")
        
        # Afficher quelques produits pour vérifier les IDs
        products = db.query(Produit).limit(5).all()
        print("\nExemples de produits:")
        for product in products:
            print(f"  ID: {product.id_produit}, Nom: {product.nom}")
        
        print("\n✅ Base de données remplie avec succès !")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_and_seed()









