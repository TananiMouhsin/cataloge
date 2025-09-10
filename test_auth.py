#!/usr/bin/env python3
"""
Script pour tester l'authentification complète
"""
import requests
import json

BASE_URL = "http://localhost:8000"

def test_auth():
    """Tester l'authentification complète"""
    print("=== Test d'authentification ===")
    
    # Test 1: Login avec l'utilisateur existant
    print("\n1. Test de login...")
    login_data = {
        "email": "othmanegamghal@gmail.com",
        "password": "admin123"  # Mot de passe par défaut
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            auth_data = response.json()
            print(f"✓ Login réussi!")
            print(f"  Token: {auth_data['access_token'][:50]}...")
            print(f"  Role: {auth_data['role']}")
            print(f"  User ID: {auth_data['user_id']}")
            
            # Test 2: Utiliser le token pour /auth/me
            print("\n2. Test de /auth/me...")
            headers = {"Authorization": f"Bearer {auth_data['access_token']}"}
            me_response = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            print(f"Status: {me_response.status_code}")
            
            if me_response.status_code == 200:
                user_data = me_response.json()
                print(f"✓ /auth/me réussi!")
                print(f"  User: {user_data}")
            else:
                print(f"❌ /auth/me échoué: {me_response.text}")
                
        else:
            print(f"❌ Login échoué: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    # Test 3: Test de signup
    print("\n3. Test de signup...")
    signup_data = {
        "nom": "Test User",
        "email": "test@example.com",
        "password": "test123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/signup", json=signup_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            auth_data = response.json()
            print(f"✓ Signup réussi!")
            print(f"  Token: {auth_data['access_token'][:50]}...")
            print(f"  Role: {auth_data['role']}")
        else:
            print(f"❌ Signup échoué: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")

if __name__ == "__main__":
    test_auth()



