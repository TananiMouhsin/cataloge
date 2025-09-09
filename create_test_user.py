#!/usr/bin/env python3
"""
Script pour créer un utilisateur de test avec un mot de passe correct
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import SessionLocal
from backend.models import Utilisateurs
from backend import security

def create_test_user():
    """Créer un utilisateur de test"""
    db = SessionLocal()
    
    try:
        # Supprimer l'ancien utilisateur s'il existe
        existing_user = db.query(Utilisateurs).filter(Utilisateurs.email == "test@example.com").first()
        if existing_user:
            db.delete(existing_user)
            print("✓ Ancien utilisateur supprimé")
        
        # Créer un nouvel utilisateur avec un mot de passe hashé correctement
        test_user = Utilisateurs(
            nom="Test User",
            email="test@example.com",
            mdp_hash=security.hash_password("test123"),
            role="client"
        )
        
        db.add(test_user)
        db.commit()
        db.refresh(test_user)
        
        print(f"✓ Utilisateur de test créé:")
        print(f"  Email: test@example.com")
        print(f"  Password: test123")
        print(f"  Role: client")
        print(f"  ID: {test_user.id_users}")
        
        # Vérifier le hash
        is_valid = security.verify_password("test123", test_user.mdp_hash)
        print(f"✓ Vérification du mot de passe: {'OK' if is_valid else 'ERREUR'}")
        
    except Exception as e:
        print(f"❌ Erreur: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()


