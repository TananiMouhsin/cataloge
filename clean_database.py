#!/usr/bin/env python3
"""
Script pour nettoyer la base de données avant la migration
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import SessionLocal
from backend.models import Commande, Stocker, Produit, Categorie, Marque

def clean_database():
    """Supprimer toutes les données existantes"""
    db = SessionLocal()
    
    try:
        print("Nettoyage de la base de données...")
        
        # Supprimer dans l'ordre des dépendances
        print("Suppression des commandes...")
        db.query(Commande).delete()
        
        print("Suppression des stockages...")
        db.query(Stocker).delete()
        
        print("Suppression des produits...")
        db.query(Produit).delete()
        
        print("Suppression des catégories...")
        db.query(Categorie).delete()
        
        print("Suppression des marques...")
        db.query(Marque).delete()
        
        db.commit()
        print("✓ Base de données nettoyée")
        
    except Exception as e:
        print(f"Erreur lors du nettoyage: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clean_database()











