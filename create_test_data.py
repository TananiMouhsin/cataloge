#!/usr/bin/env python3
import sqlite3
from datetime import datetime, timedelta
import random

def create_test_data():
    conn = sqlite3.connect('catalogue.db')
    cursor = conn.cursor()
    
    print("=== Création de données de test ===")
    
    # Créer des catégories
    categories = [
        (1, 'Électronique'),
        (2, 'Vêtements'),
        (3, 'Maison'),
        (4, 'Sport'),
        (5, 'Livre')
    ]
    
    print("Création des catégories...")
    for cat_id, nom in categories:
        try:
            cursor.execute("INSERT OR IGNORE INTO Categorie (id_categorie, nom) VALUES (?, ?)", (cat_id, nom))
        except:
            pass
    
    # Créer des marques
    marques = [
        (1, 'Apple'),
        (2, 'Samsung'),
        (3, 'Nike'),
        (4, 'Adidas'),
        (5, 'IKEA'),
        (6, 'Zara'),
        (7, 'H&M'),
        (8, 'Sony'),
        (9, 'LG'),
        (10, 'Canon')
    ]
    
    print("Création des marques...")
    for marque_id, nom in marques:
        try:
            cursor.execute("INSERT OR IGNORE INTO Marque (id_marque, nom) VALUES (?, ?)", (marque_id, nom))
        except:
            pass
    
    # Créer des produits
    produits = [
        (1, 'iPhone 15', 'Smartphone Apple dernière génération', 999.99, 50, 1, 1, '/images/iphone15.jpg'),
        (2, 'Samsung Galaxy S24', 'Smartphone Samsung haut de gamme', 899.99, 30, 1, 2, '/images/galaxy-s24.jpg'),
        (3, 'MacBook Pro', 'Ordinateur portable professionnel', 1999.99, 20, 1, 1, '/images/macbook-pro.jpg'),
        (4, 'Nike Air Max', 'Chaussures de sport confortables', 129.99, 100, 2, 3, '/images/nike-airmax.jpg'),
        (5, 'Adidas Ultraboost', 'Chaussures de course', 149.99, 80, 2, 4, '/images/adidas-ultraboost.jpg'),
        (6, 'T-shirt Zara', 'T-shirt en coton bio', 19.99, 200, 2, 6, '/images/tshirt-zara.jpg'),
        (7, 'Table IKEA', 'Table en bois massif', 299.99, 15, 3, 5, '/images/table-ikea.jpg'),
        (8, 'Chaise IKEA', 'Chaise ergonomique', 89.99, 50, 3, 5, '/images/chaise-ikea.jpg'),
        (9, 'Ballon de football', 'Ballon officiel FIFA', 29.99, 100, 4, 4, '/images/ballon-football.jpg'),
        (10, 'Livre Python', 'Guide complet Python', 39.99, 25, 5, 7, '/images/livre-python.jpg')
    ]
    
    print("Création des produits...")
    for prod_id, nom, desc, prix, stock, cat_id, marque_id, image in produits:
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO Produit 
                (id_produit, nom, description, prix, stock, id_categorie, id_marque, qr_code_path, date_creation, reste)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (prod_id, nom, desc, prix, stock, cat_id, marque_id, image, datetime.now(), stock))
        except Exception as e:
            print(f"Erreur produit {prod_id}: {e}")
    
    # Créer des commandes
    print("Création des commandes...")
    commandes = [
        (1, 2, 1, 1, 999.99, 'Pending', datetime.now() - timedelta(days=2)),
        (2, 2, 2, 2, 899.99, 'Completed', datetime.now() - timedelta(days=1)),
        (3, 3, 3, 1, 1999.99, 'Pending', datetime.now() - timedelta(hours=5)),
        (4, 4, 4, 3, 129.99, 'Completed', datetime.now() - timedelta(days=3)),
        (5, 4, 5, 2, 149.99, 'Pending', datetime.now() - timedelta(hours=12)),
        (6, 9, 6, 5, 19.99, 'Canceled', datetime.now() - timedelta(days=1)),
        (7, 8, 7, 1, 299.99, 'Completed', datetime.now() - timedelta(days=4)),
        (8, 8, 8, 4, 89.99, 'Pending', datetime.now() - timedelta(hours=2)),
        (9, 2, 9, 2, 29.99, 'Completed', datetime.now() - timedelta(days=2)),
        (10, 3, 10, 1, 39.99, 'Pending', datetime.now() - timedelta(hours=1))
    ]
    
    for cmd_id, user_id, prod_id, quantite, prix, statut, date in commandes:
        try:
            cursor.execute("""
                INSERT OR IGNORE INTO Commande 
                (id_commande, id_users, id_produit, quantite, prix_unitaire, statut, date_commande)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (cmd_id, user_id, prod_id, quantite, prix, statut, date))
        except Exception as e:
            print(f"Erreur commande {cmd_id}: {e}")
    
    conn.commit()
    conn.close()
    
    print("✓ Données de test créées avec succès!")
    print("- 5 catégories")
    print("- 10 marques") 
    print("- 10 produits")
    print("- 10 commandes")

if __name__ == "__main__":
    create_test_data()

