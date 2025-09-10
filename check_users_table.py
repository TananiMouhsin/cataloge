#!/usr/bin/env python3
"""
Script pour vérifier et créer la table Utilisateurs si nécessaire
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.database import SessionLocal, engine
from backend.models import Utilisateurs, Base

def check_and_create_users_table():
    """Vérifier et créer la table Utilisateurs"""
    try:
        print("Vérification de la table Utilisateurs...")
        
        # Créer toutes les tables si elles n'existent pas
        Base.metadata.create_all(bind=engine)
        print("✓ Tables créées/vérifiées")
        
        # Vérifier si la table Utilisateurs existe et a des données
        db = SessionLocal()
        try:
            users_count = db.query(Utilisateurs).count()
            print(f"✓ Table Utilisateurs existe avec {users_count} utilisateurs")
            
            if users_count == 0:
                print("Aucun utilisateur trouvé. Créons un utilisateur admin par défaut...")
                from backend import security
                
                admin_user = Utilisateurs(
                    nom="Admin",
                    email="admin@example.com",
                    mdp_hash=security.hash_password("admin123"),
                    role="admin"
                )
                db.add(admin_user)
                db.commit()
                print("✓ Utilisateur admin créé (email: admin@example.com, password: admin123)")
            
            # Afficher tous les utilisateurs
            users = db.query(Utilisateurs).all()
            print("\nUtilisateurs existants:")
            for user in users:
                role = user.role.value if hasattr(user.role, "value") else str(user.role)
                print(f"  - ID: {user.id_users}, Nom: {user.nom}, Email: {user.email}, Role: {role}")
                
        except Exception as e:
            print(f"Erreur lors de la vérification des utilisateurs: {e}")
            db.rollback()
        finally:
            db.close()
            
    except Exception as e:
        print(f"Erreur générale: {e}")

if __name__ == "__main__":
    check_and_create_users_table()



