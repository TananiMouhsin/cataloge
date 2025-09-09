#!/usr/bin/env python3
"""
Test des endpoints admin
"""
import urllib.request
import json

def get_admin_token():
    """Obtenir le token admin"""
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
            return result['access_token']
    except Exception as e:
        print(f"❌ Erreur login: {e}")
        return None

def test_create_product(token):
    """Test de création de produit"""
    url = "http://localhost:8000/products"
    data = {
        "id_categorie": 1,
        "id_marque": 1,
        "nom": "Test Product Admin",
        "description": "Produit créé par admin",
        "prix": 99.99,
        "stock": 10,
        "qr_code_path": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            }
        )
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ Création de produit réussie!")
            print(f"Produit créé: {result['nom']} (ID: {result['id_produit']})")
            return result['id_produit']
    except Exception as e:
        print(f"❌ Erreur création produit: {e}")
        return None

def test_update_product(token, product_id):
    """Test de mise à jour de produit"""
    url = f"http://localhost:8000/products/{product_id}"
    data = {
        "nom": "Test Product Admin Updated",
        "prix": 149.99
    }
    
    try:
        req = urllib.request.Request(
            url,
            data=json.dumps(data).encode('utf-8'),
            headers={
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {token}'
            }
        )
        req.get_method = lambda: 'PUT'
        
        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print("✅ Mise à jour de produit réussie!")
            print(f"Produit mis à jour: {result['nom']} (Prix: {result['prix']})")
    except Exception as e:
        print(f"❌ Erreur mise à jour produit: {e}")

def test_delete_product(token, product_id):
    """Test de suppression de produit"""
    url = f"http://localhost:8000/products/{product_id}"
    
    try:
        req = urllib.request.Request(
            url,
            headers={'Authorization': f'Bearer {token}'}
        )
        req.get_method = lambda: 'DELETE'
        
        with urllib.request.urlopen(req) as response:
            print("✅ Suppression de produit réussie!")
    except Exception as e:
        print(f"❌ Erreur suppression produit: {e}")

if __name__ == "__main__":
    print("=== Test des endpoints ADMIN ===")
    
    # Obtenir le token admin
    token = get_admin_token()
    if not token:
        print("❌ Impossible d'obtenir le token admin")
        exit(1)
    
    print(f"✅ Token admin obtenu: {token[:50]}...")
    
    # Test création de produit
    product_id = test_create_product(token)
    
    if product_id:
        # Test mise à jour
        test_update_product(token, product_id)
        
        # Test suppression
        test_delete_product(token, product_id)
    
    print("\n✅ Tests des endpoints admin terminés!")


