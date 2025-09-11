#!/usr/bin/env python3
import requests
import sys

BASE = "http://localhost:8000"

def login(email: str, password: str) -> str:
    r = requests.post(f"{BASE}/auth/login", json={"email": email, "password": password})
    r.raise_for_status()
    return r.json()["access_token"]

def get_products():
    r = requests.get(f"{BASE}/products")
    r.raise_for_status()
    return r.json()

def add_to_cart(token: str, id_produit: int, quantite: int = 1):
    r = requests.post(
        f"{BASE}/cart/add",
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        json={"id_produit": id_produit, "quantite": quantite},
    )
    r.raise_for_status()
    return r.json()

def create_order(token: str):
    r = requests.post(f"{BASE}/orders", headers={"Authorization": f"Bearer {token}"})
    r.raise_for_status()
    return r.json()

def fetch_orders_admin(token: str):
    r = requests.get(f"{BASE}/orders", headers={"Authorization": f"Bearer {token}"})
    r.raise_for_status()
    return r.json()

def main():
    # Ensure test user exists: assume you already ran create_test_user.py outside
    # 1) Login as test user
    user_token = login("test@example.com", "test123")

    # 2) Pick first product
    products = get_products()
    if not products:
        print("No products available.")
        sys.exit(1)
    pid = products[0]["id_produit"]

    # 3) Add to cart and create order
    add_to_cart(user_token, pid, 1)
    order = create_order(user_token)
    print("Created order for user:", order)

    # 4) Login as admin and fetch orders
    admin_token = login("admin@example.com", "admin123")
    orders = fetch_orders_admin(admin_token)
    print(f"Admin sees {len(orders)} order rows")
    # Print first few rows for verification
    for row in orders[:5]:
        print(row)

if __name__ == "__main__":
    main()


