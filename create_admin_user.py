#!/usr/bin/env python3
"""
Script pour créer un utilisateur admin avec mot de passe hashé
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import SessionLocal
from backend.models import Utilisateurs, UserRole
from backend.security import hash_password

def create_admin_user():
    db = SessionLocal()
    
    try:
        # Vérifier si l'admin existe déjà
        existing_admin = db.query(Utilisateurs).filter(Utilisateurs.email == "admin@example.com").first()
        if existing_admin:
            print("Utilisateur admin existe déjà")
            return
        
        # Créer l'utilisateur admin
        admin_user = Utilisateurs(
            nom="Admin",
            email="admin@example.com",
            mdp_hash=hash_password("admin123"),
            role=UserRole.admin
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"✓ Utilisateur admin créé avec l'ID: {admin_user.id_users}")
        print("Email: admin@example.com")
        print("Mot de passe: admin123")
        
    except Exception as e:
        print(f"Erreur lors de la création de l'admin: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_admin_user()
