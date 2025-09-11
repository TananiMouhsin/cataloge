#!/usr/bin/env python3
"""
Test complet de tous les endpoints admin
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

def test_category_crud(token):
    """Test CRUD des catégories"""
    print("\n=== Test CRUD Catégories ===")
    
    # Créer une catégorie
    url = "http://localhost:8000/categories"
    data = {"nom": "Test Category Admin"}
    
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
            print(f"✅ Catégorie créée: {result['nom']} (ID: {result['id_categorie']})")
            category_id = result['id_categorie']
    except Exception as e:
        print(f"❌ Erreur création catégorie: {e}")
        return
    
    # Mettre à jour la catégorie
    url = f"http://localhost:8000/categories/{category_id}"
    data = {"nom": "Test Category Admin Updated"}
    
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
            print(f"✅ Catégorie mise à jour: {result['nom']}")
    except Exception as e:
        print(f"❌ Erreur mise à jour catégorie: {e}")
    
    # Supprimer la catégorie
    url = f"http://localhost:8000/categories/{category_id}"
    
    try:
        req = urllib.request.Request(
            url,
            headers={'Authorization': f'Bearer {token}'}
        )
        req.get_method = lambda: 'DELETE'
        
        with urllib.request.urlopen(req) as response:
            print("✅ Catégorie supprimée")
    except Exception as e:
        print(f"❌ Erreur suppression catégorie: {e}")

def test_brand_crud(token):
    """Test CRUD des marques"""
    print("\n=== Test CRUD Marques ===")
    
    # Créer une marque
    url = "http://localhost:8000/brands"
    data = {"nom": "Test Brand Admin"}
    
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
            print(f"✅ Marque créée: {result['nom']} (ID: {result['id_marque']})")
            brand_id = result['id_marque']
    except Exception as e:
        print(f"❌ Erreur création marque: {e}")
        return
    
    # Mettre à jour la marque
    url = f"http://localhost:8000/brands/{brand_id}"
    data = {"nom": "Test Brand Admin Updated"}
    
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
            print(f"✅ Marque mise à jour: {result['nom']}")
    except Exception as e:
        print(f"❌ Erreur mise à jour marque: {e}")
    
    # Supprimer la marque
    url = f"http://localhost:8000/brands/{brand_id}"
    
    try:
        req = urllib.request.Request(
            url,
            headers={'Authorization': f'Bearer {token}'}
        )
        req.get_method = lambda: 'DELETE'
        
        with urllib.request.urlopen(req) as response:
            print("✅ Marque supprimée")
    except Exception as e:
        print(f"❌ Erreur suppression marque: {e}")

def test_product_crud(token):
    """Test CRUD des produits"""
    print("\n=== Test CRUD Produits ===")
    
    # Créer un produit
    url = "http://localhost:8000/products"
    data = {
        "id_categorie": 1,
        "id_marque": 1,
        "nom": "Test Product Admin Final",
        "description": "Produit de test final",
        "prix": 199.99,
        "stock": 5,
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
            print(f"✅ Produit créé: {result['nom']} (ID: {result['id_produit']})")
            product_id = result['id_produit']
    except Exception as e:
        print(f"❌ Erreur création produit: {e}")
        return
    
    # Mettre à jour le produit
    url = f"http://localhost:8000/products/{product_id}"
    data = {
        "nom": "Test Product Admin Final Updated",
        "prix": 299.99
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
            print(f"✅ Produit mis à jour: {result['nom']} (Prix: {result['prix']})")
    except Exception as e:
        print(f"❌ Erreur mise à jour produit: {e}")
    
    # Supprimer le produit
    url = f"http://localhost:8000/products/{product_id}"
    
    try:
        req = urllib.request.Request(
            url,
            headers={'Authorization': f'Bearer {token}'}
        )
        req.get_method = lambda: 'DELETE'
        
        with urllib.request.urlopen(req) as response:
            print("✅ Produit supprimé")
    except Exception as e:
        print(f"❌ Erreur suppression produit: {e}")

if __name__ == "__main__":
    print("=== Test complet des endpoints ADMIN ===")
    
    # Obtenir le token admin
    token = get_admin_token()
    if not token:
        print("❌ Impossible d'obtenir le token admin")
        exit(1)
    
    print(f"✅ Token admin obtenu: {token[:50]}...")
    
    # Tests CRUD
    test_category_crud(token)
    test_brand_crud(token)
    test_product_crud(token)
    
    print("\n🎉 Tous les tests des endpoints admin sont terminés!")







