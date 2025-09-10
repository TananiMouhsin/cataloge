#!/usr/bin/env python3
"""
Script pour corriger les mots de passe des utilisateurs existants
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import SessionLocal
from backend.models import Utilisateurs
from backend import security

def fix_user_passwords():
    """Corriger les mots de passe de tous les utilisateurs"""
    db = SessionLocal()
    
    try:
        print("Correction des mots de passe des utilisateurs...")
        
        # Récupérer tous les utilisateurs
        users = db.query(Utilisateurs).all()
        
        for user in users:
            print(f"Correction de l'utilisateur: {user.email}")
            
            # Définir un nouveau mot de passe basé sur le rôle
            if user.role == "admin":
                new_password = "admin123"
            else:
                new_password = "user123"
            
            # Créer un nouveau hash
            new_hash = security.hash_password(new_password)
            
            # Mettre à jour le hash
            user.mdp_hash = new_hash
            db.commit()
            
            print(f"✓ Mot de passe mis à jour pour {user.email}")
            print(f"  Nouveau mot de passe: {new_password}")
            
            # Vérifier que le nouveau hash fonctionne
            is_valid = security.verify_password(new_password, new_hash)
            print(f"  Vérification: {'OK' if is_valid else 'ERREUR'}")
            print()
        
        print("✅ Tous les mots de passe ont été corrigés!")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_user_passwords()



