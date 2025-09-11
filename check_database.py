#!/usr/bin/env python3
import sqlite3

def check_database():
    conn = sqlite3.connect('catalogue.db')
    cursor = conn.cursor()
    
    print('=== VÉRIFICATION DES DONNÉES ===')
    
    # Vérifier les tables
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    tables = cursor.fetchall()
    print('Tables:', [t[0] for t in tables])
    
    # Compter les enregistrements
    cursor.execute('SELECT COUNT(*) FROM Produit')
    prod_count = cursor.fetchone()[0]
    print(f'Produits: {prod_count}')
    
    cursor.execute('SELECT COUNT(*) FROM Commande')
    cmd_count = cursor.fetchone()[0]
    print(f'Commandes: {cmd_count}')
    
    cursor.execute('SELECT COUNT(*) FROM Categorie')
    cat_count = cursor.fetchone()[0]
    print(f'Catégories: {cat_count}')
    
    cursor.execute('SELECT COUNT(*) FROM Marque')
    marque_count = cursor.fetchone()[0]
    print(f'Marques: {marque_count}')
    
    # Afficher quelques exemples
    if prod_count > 0:
        print('\n=== PREMIERS PRODUITS ===')
        cursor.execute('SELECT id_produit, nom, prix FROM Produit LIMIT 5')
        produits = cursor.fetchall()
        for p in produits:
            print(f'ID: {p[0]}, Nom: {p[1]}, Prix: {p[2]}')
    
    if cmd_count > 0:
        print('\n=== PREMIÈRES COMMANDES ===')
        cursor.execute('SELECT id_commande, id_users, id_produit, quantite, statut FROM Commande LIMIT 5')
        commandes = cursor.fetchall()
        for c in commandes:
            print(f'ID: {c[0]}, User: {c[1]}, Produit: {c[2]}, Qty: {c[3]}, Statut: {c[4]}')
    
    conn.close()

if __name__ == "__main__":
    check_database()

