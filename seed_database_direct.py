#!/usr/bin/env python3
"""
Script pour insérer des données directement dans la base de données
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import SessionLocal
from backend.models import Categorie, Marque, Produit

def create_categories():
    """Créer les catégories"""
    db = SessionLocal()
    
    try:
        categories_data = [
            "Électronique",
            "Livres", 
            "Vêtements",
            "Sport",
            "Maison"
        ]
        
        print("Création des catégories...")
        for category_name in categories_data:
            existing = db.query(Categorie).filter(Categorie.nom == category_name).first()
            if not existing:
                category = Categorie(nom=category_name)
                db.add(category)
                print(f"✓ Catégorie '{category_name}' créée")
            else:
                print(f"✓ Catégorie '{category_name}' existe déjà")
        
        db.commit()
        
    except Exception as e:
        print(f"Erreur lors de la création des catégories: {e}")
        db.rollback()
    finally:
        db.close()

def create_brands():
    """Créer les marques"""
    db = SessionLocal()
    
    try:
        brands_data = [
            "Apple",
            "Sony", 
            "Samsung",
            "Nike",
            "Adidas"
        ]
        
        print("\nCréation des marques...")
        for brand_name in brands_data:
            existing = db.query(Marque).filter(Marque.nom == brand_name).first()
            if not existing:
                brand = Marque(nom=brand_name)
                db.add(brand)
                print(f"✓ Marque '{brand_name}' créée")
            else:
                print(f"✓ Marque '{brand_name}' existe déjà")
        
        db.commit()
        
    except Exception as e:
        print(f"Erreur lors de la création des marques: {e}")
        db.rollback()
    finally:
        db.close()

def create_products():
    """Créer les produits"""
    db = SessionLocal()
    
    try:
        products_data = [
            # Électronique
            {"id_produit": "P001", "id_categorie": 1, "id_marque": 1, "nom": "iPhone 15 Pro", "description": "Dernier iPhone avec puce A17 Pro, caméra 48MP", "prix": 1199.99, "stock": 25, "qr_code_path": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500", "reste": 25},
            {"id_produit": "P002", "id_categorie": 1, "id_marque": 2, "nom": "Sony WH-1000XM5", "description": "Casque sans fil avec réduction de bruit", "prix": 399.99, "stock": 35, "qr_code_path": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500", "reste": 35},
            {"id_produit": "P003", "id_categorie": 1, "id_marque": 3, "nom": "Samsung Galaxy S24", "description": "Smartphone Android haut de gamme", "prix": 999.99, "stock": 30, "qr_code_path": "https://images.unsplash.com/photo-1511707171631-9ed0a0b2b65d?w=500", "reste": 30},
            {"id_produit": "P004", "id_categorie": 1, "id_marque": 1, "nom": "MacBook Pro 16\"", "description": "Laptop professionnel avec puce M3 Max", "prix": 3499.99, "stock": 15, "qr_code_path": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500", "reste": 15},
            {"id_produit": "P005", "id_categorie": 1, "id_marque": 2, "nom": "Sony PlayStation 5", "description": "Console de jeu nouvelle génération", "prix": 499.99, "stock": 20, "qr_code_path": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500", "reste": 20},
            
            # Livres
            {"id_produit": "P006", "id_categorie": 2, "id_marque": 1, "nom": "MacBook Pro Guide", "description": "Guide complet pour MacBook Pro", "prix": 29.99, "stock": 50, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", "reste": 50},
            {"id_produit": "P007", "id_categorie": 2, "id_marque": 2, "nom": "Sony Camera Manual", "description": "Manuel d'utilisation appareil photo Sony", "prix": 19.99, "stock": 40, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", "reste": 40},
            {"id_produit": "P008", "id_categorie": 2, "id_marque": 3, "nom": "Samsung Galaxy Guide", "description": "Guide utilisateur Samsung Galaxy", "prix": 24.99, "stock": 45, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500", "reste": 45},
            
            # Vêtements
            {"id_produit": "P009", "id_categorie": 3, "id_marque": 4, "nom": "Nike Air Max 270", "description": "Chaussures de sport Nike Air Max", "prix": 149.99, "stock": 60, "qr_code_path": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", "reste": 60},
            {"id_produit": "P010", "id_categorie": 3, "id_marque": 5, "nom": "Adidas Ultraboost 22", "description": "Chaussures de course Adidas", "prix": 179.99, "stock": 55, "qr_code_path": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", "reste": 55},
            {"id_produit": "P011", "id_categorie": 3, "id_marque": 4, "nom": "Nike Dri-FIT T-Shirt", "description": "T-shirt de sport Nike", "prix": 29.99, "stock": 80, "qr_code_path": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500", "reste": 80},
            {"id_produit": "P012", "id_categorie": 3, "id_marque": 5, "nom": "Adidas Originals Hoodie", "description": "Sweat à capuche Adidas", "prix": 79.99, "stock": 40, "qr_code_path": "https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=500", "reste": 40},
            
            # Sport
            {"id_produit": "P013", "id_categorie": 4, "id_marque": 4, "nom": "Nike Basketball", "description": "Ballon de basket Nike", "prix": 39.99, "stock": 25, "qr_code_path": "https://images.unsplash.com/photo-1546519638-68e109f0c7c8?w=500", "reste": 25},
            {"id_produit": "P014", "id_categorie": 4, "id_marque": 5, "nom": "Adidas Football", "description": "Ballon de football Adidas", "prix": 49.99, "stock": 30, "qr_code_path": "https://images.unsplash.com/photo-1546519638-68e109f0c7c8?w=500", "reste": 30},
            {"id_produit": "P015", "id_categorie": 4, "id_marque": 4, "nom": "Nike Yoga Mat", "description": "Tapis de yoga Nike", "prix": 59.99, "stock": 35, "qr_code_path": "https://images.unsplash.com/photo-1506629905607-4b2b4b2b2b2b?w=500", "reste": 35},
            
            # Maison
            {"id_produit": "P016", "id_categorie": 5, "id_marque": 1, "nom": "Apple HomePod mini", "description": "Enceinte intelligente Apple", "prix": 99.99, "stock": 20, "qr_code_path": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500", "reste": 20},
            {"id_produit": "P017", "id_categorie": 5, "id_marque": 2, "nom": "Sony Soundbar", "description": "Barre de son Sony pour TV", "prix": 299.99, "stock": 15, "qr_code_path": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500", "reste": 15},
            {"id_produit": "P018", "id_categorie": 5, "id_marque": 3, "nom": "Samsung Smart TV 55\"", "description": "Télévision intelligente Samsung", "prix": 899.99, "stock": 10, "qr_code_path": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500", "reste": 10}
        ]
        
        print("\nCréation des produits...")
        for product_data in products_data:
            existing = db.query(Produit).filter(Produit.id_produit == product_data["id_produit"]).first()
            if not existing:
                product = Produit(**product_data)
                db.add(product)
                print(f"✓ Produit '{product_data['nom']}' créé")
            else:
                print(f"✓ Produit '{product_data['nom']}' existe déjà")
        
        db.commit()
        
    except Exception as e:
        print(f"Erreur lors de la création des produits: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("=== Script d'insertion de données directe ===")
    
    create_categories()
    create_brands()
    create_products()
    
    print("\n=== Vérification ===")
    db = SessionLocal()
    try:
        categories_count = db.query(Categorie).count()
        brands_count = db.query(Marque).count()
        products_count = db.query(Produit).count()
        
        print(f"Catégories: {categories_count}")
        print(f"Marques: {brands_count}")
        print(f"Produits: {products_count}")
        
    except Exception as e:
        print(f"Erreur lors de la vérification: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    main()
