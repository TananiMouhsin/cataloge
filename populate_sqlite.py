#!/usr/bin/env python3
import sqlite3
from datetime import datetime

def populate_database():
    conn = sqlite3.connect('catalogue.db')
    cursor = conn.cursor()
    
    print('=== PEUPLEMENT DE LA BASE SQLITE ===')
    
    # Créer des catégories
    print('Création des catégories...')
    categories = [
        (1, 'Électronique'),
        (2, 'Vêtements'),
        (3, 'Maison'),
        (4, 'Sport'),
        (5, 'Livres')
    ]
    
    for cat_id, nom in categories:
        cursor.execute("INSERT OR IGNORE INTO Categorie (id_categorie, nom) VALUES (?, ?)", (cat_id, nom))
    
    # Créer des marques
    print('Création des marques...')
    marques = [
        (1, 'Apple'),
        (2, 'Samsung'),
        (3, 'Sony'),
        (4, 'Nike'),
        (5, 'Adidas')
    ]
    
    for marque_id, nom in marques:
        cursor.execute("INSERT OR IGNORE INTO Marque (id_marque, nom) VALUES (?, ?)", (marque_id, nom))
    
    # Créer des produits
    print('Création des produits...')
    produits = [
        ('P001', 1, 1, 'iPhone 15 Pro', 'Dernier iPhone avec puce A17 Pro', 1199.99, 25, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500'),
        ('P002', 1, 2, 'Samsung Galaxy S24', 'Smartphone Android haut de gamme', 999.99, 30, 'https://images.unsplash.com/photo-1511707171631-9ed0a0b2b65d?w=500'),
        ('P003', 1, 3, 'Sony WH-1000XM5', 'Casque sans fil avec réduction de bruit', 399.99, 35, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'),
        ('P004', 1, 1, 'MacBook Pro 16"', 'Laptop professionnel avec puce M3 Max', 3499.99, 15, 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500'),
        ('P005', 1, 3, 'Sony PlayStation 5', 'Console de jeu nouvelle génération', 499.99, 20, 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500'),
        ('P006', 2, 4, 'Nike Air Max', 'Chaussures de sport confortables', 129.99, 100, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'),
        ('P007', 2, 5, 'Adidas Ultraboost', 'Chaussures de course', 149.99, 80, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'),
        ('P008', 5, 1, 'Guide MacBook Pro', 'Guide complet pour MacBook Pro', 29.99, 50, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500'),
        ('P009', 3, 1, 'Table Apple Design', 'Table moderne en bois et métal', 599.99, 10, 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500'),
        ('P010', 4, 4, 'Ballon Nike', 'Ballon de football officiel', 29.99, 200, 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=500')
    ]
    
    for prod_id, cat_id, marque_id, nom, desc, prix, stock, image in produits:
        cursor.execute("""
            INSERT OR IGNORE INTO Produit 
            (id_produit, id_categorie, id_marque, nom, description, prix, stock, qr_code_path, date_creation, reste)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (prod_id, cat_id, marque_id, nom, desc, prix, stock, image, datetime.now(), stock))
    
    # Créer des commandes
    print('Création des commandes...')
    commandes = [
        (1, 2, 'P001', 1, 1199.99, 'Pending', datetime.now()),
        (2, 2, 'P002', 2, 999.99, 'Completed', datetime.now()),
        (3, 3, 'P003', 1, 399.99, 'Pending', datetime.now()),
        (4, 4, 'P004', 1, 3499.99, 'Completed', datetime.now()),
        (5, 8, 'P005', 1, 499.99, 'Pending', datetime.now()),
        (6, 9, 'P006', 3, 129.99, 'Canceled', datetime.now()),
        (7, 2, 'P007', 2, 149.99, 'Completed', datetime.now()),
        (8, 3, 'P008', 1, 29.99, 'Pending', datetime.now()),
        (9, 4, 'P009', 1, 599.99, 'Completed', datetime.now()),
        (10, 8, 'P010', 5, 29.99, 'Pending', datetime.now())
    ]
    
    for cmd_id, user_id, prod_id, quantite, prix, statut, date in commandes:
        cursor.execute("""
            INSERT OR IGNORE INTO Commande 
            (id_commande, id_users, id_produit, quantite, prix_unitaire, statut, date_commande)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (cmd_id, user_id, prod_id, quantite, prix, statut, date))
    
    conn.commit()
    
    # Vérifier les données
    cursor.execute('SELECT COUNT(*) FROM Produit')
    prod_count = cursor.fetchone()[0]
    cursor.execute('SELECT COUNT(*) FROM Commande')
    cmd_count = cursor.fetchone()[0]
    cursor.execute('SELECT COUNT(*) FROM Categorie')
    cat_count = cursor.fetchone()[0]
    cursor.execute('SELECT COUNT(*) FROM Marque')
    marque_count = cursor.fetchone()[0]
    
    print(f'✓ Données créées:')
    print(f'  - {cat_count} catégories')
    print(f'  - {marque_count} marques')
    print(f'  - {prod_count} produits')
    print(f'  - {cmd_count} commandes')
    
    conn.close()

if __name__ == "__main__":
    populate_database()

