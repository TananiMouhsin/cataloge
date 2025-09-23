#!/usr/bin/env python3
"""
Test avec le nouvel utilisateur
"""
import urllib.request
import json

def test_login():
    url = "http://localhost:8000/auth/login"
    data = {
        "email": "test@example.com",
        "password": "test123"
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ Login réussi!")
            print(f"Token: {result['access_token'][:50]}...")
            print(f"Role: {result['role']}")
            print(f"User ID: {result['user_id']}")
            return result['access_token']
            
    except Exception as e:
        print(f"❌ Erreur login: {e}")
        return None

def test_me(token):
    url = "http://localhost:8000/auth/me"
    
    try:
        req = urllib.request.Request(
            url,
            headers={'Authorization': f'Bearer {token}'}
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ Auth/me réussi!")
            print(f"User: {result}")
            
    except Exception as e:
        print(f"❌ Erreur auth/me: {e}")

if __name__ == "__main__":
    print("=== Test d'authentification avec nouvel utilisateur ===")
    token = test_login()
    if token:
        test_me(token)









