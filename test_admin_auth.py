#!/usr/bin/env python3
"""
Test d'authentification admin
"""
import urllib.request
import json

def test_admin_login():
    url = "http://localhost:8000/auth/login"
    data = {
        "email": "othmanegamghal@gmail.com",
        "password": "admin123"
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ Login admin réussi!")
            print(f"Token: {result['access_token'][:50]}...")
            print(f"Role: {result['role']}")
            print(f"User ID: {result['user_id']}")
            return result['access_token']
            
    except Exception as e:
        print(f"❌ Erreur login admin: {e}")
        return None

def test_admin_me(token):
    url = "http://localhost:8000/auth/me"
    
    try:
        req = urllib.request.Request(
            url,
            headers={'Authorization': f'Bearer {token}'}
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ Auth/me admin réussi!")
            print(f"User: {result}")
            
    except Exception as e:
        print(f"❌ Erreur auth/me admin: {e}")

if __name__ == "__main__":
    print("=== Test d'authentification ADMIN ===")
    token = test_admin_login()
    if token:
        test_admin_me(token)









