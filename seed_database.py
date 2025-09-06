#!/usr/bin/env python3
"""
Script pour insérer des données dans la base de données via l'API
"""
import requests
import json

API_URL = "http://localhost:8000"

def create_admin_user():
    """Créer un utilisateur admin"""
    print("Création de l'utilisateur admin...")
    try:
        admin_data = {
            "nom": "Admin",
            "email": "admin@example.com", 
            "password": "admin123"
        }
        response = requests.post(f"{API_URL}/auth/signup", json=admin_data)
        if response.status_code == 200:
            data = response.json()
            print("✓ Utilisateur admin créé")
            return data["access_token"]
        else:
            print(f"✗ Erreur création admin: {response.text}")
            return None
    except Exception as e:
        print(f"✗ Erreur de connexion pour admin: {e}")
        return None

def create_categories(token):
    """Créer les catégories"""
    categories = [
        "Électronique",
        "Livres", 
        "Vêtements",
        "Sport",
        "Maison"
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    print("Création des catégories...")
    for category in categories:
        try:
            response = requests.post(f"{API_URL}/categories", params={"nom": category}, headers=headers)
            if response.status_code == 200:
                print(f"✓ Catégorie '{category}' créée")
            else:
                print(f"✗ Erreur pour '{category}': {response.text}")
        except Exception as e:
            print(f"✗ Erreur de connexion pour '{category}': {e}")

def create_brands(token):
    """Créer les marques"""
    brands = [
        "Apple",
        "Sony", 
        "Samsung",
        "Nike",
        "Adidas"
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    print("\nCréation des marques...")
    for brand in brands:
        try:
            response = requests.post(f"{API_URL}/brands", params={"nom": brand}, headers=headers)
            if response.status_code == 200:
                print(f"✓ Marque '{brand}' créée")
            else:
                print(f"✗ Erreur pour '{brand}': {response.text}")
        except Exception as e:
            print(f"✗ Erreur de connexion pour '{brand}': {e}")

def create_products(token):
    """Créer les produits"""
    products = [
        # Électronique
        {"id_produit": "P001", "id_categorie": 1, "id_marque": 1, "nom": "iPhone 15 Pro", "description": "Dernier iPhone avec puce A17 Pro, caméra 48MP", "prix": 1199.99, "stock": 25, "qr_code_path": "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500"},
        {"id_produit": "P002", "id_categorie": 1, "id_marque": 2, "nom": "Sony WH-1000XM5", "description": "Casque sans fil avec réduction de bruit", "prix": 399.99, "stock": 35, "qr_code_path": "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500"},
        {"id_produit": "P003", "id_categorie": 1, "id_marque": 3, "nom": "Samsung Galaxy S24", "description": "Smartphone Android haut de gamme", "prix": 999.99, "stock": 30, "qr_code_path": "https://images.unsplash.com/photo-1511707171631-9ed0a0b2b65d?w=500"},
        {"id_produit": "P004", "id_categorie": 1, "id_marque": 1, "nom": "MacBook Pro 16\"", "description": "Laptop professionnel avec puce M3 Max", "prix": 3499.99, "stock": 15, "qr_code_path": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500"},
        {"id_produit": "P005", "id_categorie": 1, "id_marque": 2, "nom": "Sony PlayStation 5", "description": "Console de jeu nouvelle génération", "prix": 499.99, "stock": 20, "qr_code_path": "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500"},
        
        # Livres
        {"id_produit": "P006", "id_categorie": 2, "id_marque": 1, "nom": "MacBook Pro Guide", "description": "Guide complet pour MacBook Pro", "prix": 29.99, "stock": 50, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"},
        {"id_produit": "P007", "id_categorie": 2, "id_marque": 2, "nom": "Sony Camera Manual", "description": "Manuel d'utilisation appareil photo Sony", "prix": 19.99, "stock": 40, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"},
        {"id_produit": "P008", "id_categorie": 2, "id_marque": 3, "nom": "Samsung Galaxy Guide", "description": "Guide utilisateur Samsung Galaxy", "prix": 24.99, "stock": 45, "qr_code_path": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500"},
        
        # Vêtements
        {"id_produit": "P009", "id_categorie": 3, "id_marque": 4, "nom": "Nike Air Max 270", "description": "Chaussures de sport Nike Air Max", "prix": 149.99, "stock": 60, "qr_code_path": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"},
        {"id_produit": "P010", "id_categorie": 3, "id_marque": 5, "nom": "Adidas Ultraboost 22", "description": "Chaussures de course Adidas", "prix": 179.99, "stock": 55, "qr_code_path": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500"},
        {"id_produit": "P011", "id_categorie": 3, "id_marque": 4, "nom": "Nike Dri-FIT T-Shirt", "description": "T-shirt de sport Nike", "prix": 29.99, "stock": 80, "qr_code_path": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"},
        {"id_produit": "P012", "id_categorie": 3, "id_marque": 5, "nom": "Adidas Originals Hoodie", "description": "Sweat à capuche Adidas", "prix": 79.99, "stock": 40, "qr_code_path": "https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=500"},
        
        # Sport
        {"id_produit": "P013", "id_categorie": 4, "id_marque": 4, "nom": "Nike Basketball", "description": "Ballon de basket Nike", "prix": 39.99, "stock": 25, "qr_code_path": "https://images.unsplash.com/photo-1546519638-68e109f0c7c8?w=500"},
        {"id_produit": "P014", "id_categorie": 4, "id_marque": 5, "nom": "Adidas Football", "description": "Ballon de football Adidas", "prix": 49.99, "stock": 30, "qr_code_path": "https://images.unsplash.com/photo-1546519638-68e109f0c7c8?w=500"},
        {"id_produit": "P015", "id_categorie": 4, "id_marque": 4, "nom": "Nike Yoga Mat", "description": "Tapis de yoga Nike", "prix": 59.99, "stock": 35, "qr_code_path": "https://images.unsplash.com/photo-1506629905607-4b2b4b2b2b2b?w=500"},
        
        # Maison
        {"id_produit": "P016", "id_categorie": 5, "id_marque": 1, "nom": "Apple HomePod mini", "description": "Enceinte intelligente Apple", "prix": 99.99, "stock": 20, "qr_code_path": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500"},
        {"id_produit": "P017", "id_categorie": 5, "id_marque": 2, "nom": "Sony Soundbar", "description": "Barre de son Sony pour TV", "prix": 299.99, "stock": 15, "qr_code_path": "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500"},
        {"id_produit": "P018", "id_categorie": 5, "id_marque": 3, "nom": "Samsung Smart TV 55\"", "description": "Télévision intelligente Samsung", "prix": 899.99, "stock": 10, "qr_code_path": "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500"}
    ]
    
    headers = {"Authorization": f"Bearer {token}"}
    print("\nCréation des produits...")
    for product in products:
        try:
            response = requests.post(f"{API_URL}/products", params=product, headers=headers)
            if response.status_code == 200:
                print(f"✓ Produit '{product['nom']}' créé")
            else:
                print(f"✗ Erreur pour '{product['nom']}': {response.text}")
        except Exception as e:
            print(f"✗ Erreur de connexion pour '{product['nom']}': {e}")

def main():
    print("=== Script d'insertion de données ===")
    print(f"API URL: {API_URL}")
    
    # Vérifier si l'API est accessible
    try:
        response = requests.get(f"{API_URL}/health")
        if response.status_code == 200:
            print("✓ API accessible")
        else:
            print("✗ API non accessible")
            return
    except Exception as e:
        print(f"✗ Erreur de connexion à l'API: {e}")
        return
    
    # Créer l'utilisateur admin et obtenir le token
    token = create_admin_user()
    if not token:
        print("Impossible de créer l'utilisateur admin. Arrêt du script.")
        return
    
    # Créer les données
    create_categories(token)
    create_brands(token)
    create_products(token)
    
    print("\n=== Vérification ===")
    try:
        # Vérifier les catégories
        response = requests.get(f"{API_URL}/categories")
        categories = response.json()
        print(f"Catégories créées: {len(categories)}")
        
        # Vérifier les marques
        response = requests.get(f"{API_URL}/brands")
        brands = response.json()
        print(f"Marques créées: {len(brands)}")
        
        # Vérifier les produits
        response = requests.get(f"{API_URL}/products")
        products = response.json()
        print(f"Produits créés: {len(products)}")
        
    except Exception as e:
        print(f"Erreur lors de la vérification: {e}")

if __name__ == "__main__":
    main()
