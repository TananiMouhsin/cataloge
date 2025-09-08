from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from . import models, schemas, security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select


auth_scheme = HTTPBearer(auto_error=False)


def _require_auth(credentials: HTTPAuthorizationCredentials | None) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = credentials.credentials
    try:
        return security.decode_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid token")


def _require_admin(payload: dict):
    if payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")


router = APIRouter()


@router.post("/auth/signup", response_model=schemas.AuthResponse)
def signup(payload: schemas.SignupRequest, db: Session = Depends(get_db)):
    existing = db.query(models.Utilisateurs).filter(models.Utilisateurs.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already used")
    role_value = None
    if payload.role in ("admin", "client"):
        role_value = models.UserRole(payload.role)
    user = models.Utilisateurs(
        nom=payload.nom,
        email=payload.email,
        mdp_hash=security.hash_password(payload.password),
        role=role_value or models.UserRole.client,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    role = user.role.value if hasattr(user.role, "value") else str(user.role)
    token = security.create_access_token(str(user.id_users), role)
    return schemas.AuthResponse(access_token=token, role=role, user_id=user.id_users, nom=user.nom or "", email=user.email)


@router.post("/auth/login", response_model=schemas.AuthResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.Utilisateurs).filter(models.Utilisateurs.email == payload.email).first()
    if not user or not security.verify_password(payload.password, user.mdp_hash or ""):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    role = user.role.value if hasattr(user.role, "value") else str(user.role)
    token = security.create_access_token(str(user.id_users), role)
    return schemas.AuthResponse(access_token=token, role=role, user_id=user.id_users, nom=user.nom or "", email=user.email)


@router.get("/auth/me", response_model=schemas.UserResponse)
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme), db: Session = Depends(get_db)):
    payload = _require_auth(credentials)
    user = db.query(models.Utilisateurs).filter(models.Utilisateurs.id_users == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    role = user.role.value if hasattr(user.role, "value") else str(user.role)
    return schemas.UserResponse(
        id_users=user.id_users,
        nom=user.nom or "",
        email=user.email,
        role=role
    )




# Read-only lists
@router.get("/categories", response_model=list[schemas.CategorieOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Categorie).all()


@router.get("/brands", response_model=list[schemas.MarqueOut])
def list_brands(db: Session = Depends(get_db)):
    return db.query(models.Marque).all()


@router.get("/products", response_model=list[schemas.ProduitWithDetails])
def list_products(db: Session = Depends(get_db)):
    products = db.query(models.Produit).all()
    return products


# Admin CRUD
@router.post("/products", response_model=schemas.ProduitOut)
def create_product(
    product_data: schemas.ProductCreate,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    prod = models.Produit(**product_data.dict())
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod


@router.put("/products/{id_produit}", response_model=schemas.ProduitOut)
def update_product(
    id_produit: int,
    product_data: schemas.ProductUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    prod = db.query(models.Produit).get(id_produit)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Mettre à jour seulement les champs fournis
    update_data = product_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(prod, field, value)
    
    db.commit()
    db.refresh(prod)
    return prod


@router.delete("/products/{id_produit}")
def delete_product(
    id_produit: int,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    prod = db.query(models.Produit).get(id_produit)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(prod)
    db.commit()
    return {"ok": True}


@router.post("/categories", response_model=schemas.CategorieOut)
def create_category(
    category_data: schemas.CategorieCreate,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db)
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    cat = models.Categorie(**category_data.dict())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.post("/brands", response_model=schemas.MarqueOut)
def create_brand(
    brand_data: schemas.MarqueCreate,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db)
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    brand = models.Marque(**brand_data.dict())
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


# Cart endpoints - per-user cart using Panier and Stocker.id_panier
@router.post("/cart/add")
def cart_add(
    item: schemas.CartAddItem,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    # Ensure cart exists
    cart = db.query(models.Panier).filter(models.Panier.id_users == user_id).first()
    if not cart:
        cart = models.Panier(id_users=user_id)
        db.add(cart)
        db.commit()
        db.refresh(cart)
    # Upsert item in Stocker for this user's cart (id_panier + id_produit)
    stock = (
        db.query(models.Stocker)
        .filter(
            models.Stocker.id_panier == cart.id_panier,
            models.Stocker.id_produit == item.id_produit,
        )
        .first()
    )
    if stock:
        stock.quantite_stock = (stock.quantite_stock or 0) + max(1, item.quantite)
    else:
        stock = models.Stocker(
            id_panier=cart.id_panier,
            id_produit=item.id_produit,
            quantite_stock=max(1, item.quantite),
        )
        db.add(stock)
    db.commit()
    return {"ok": True}


@router.get("/cart", response_model=schemas.CartOut)
def get_cart(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    cart = db.query(models.Panier).filter(models.Panier.id_users == user_id).first()
    if not cart:
        return schemas.CartOut(id_panier=0, id_users=user_id, items=[])
    items = (
        db.query(models.Stocker)
        .filter(models.Stocker.id_panier == cart.id_panier)
        .all()
    )
    return schemas.CartOut(
        id_panier=cart.id_panier,
        id_users=user_id,
        items=[
            schemas.CartItemOut(
                id_produit=i.id_produit, quantite=i.quantite_stock or 0
            )
            for i in items
        ],
    )


@router.post("/orders", response_model=schemas.OrderOut)
def create_order(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    # Retrieve cart
    cart = db.query(models.Panier).filter(models.Panier.id_users == user_id).first()
    if not cart:
        raise HTTPException(status_code=400, detail="Cart is empty")
    items = (
        db.query(models.Stocker)
        .filter(models.Stocker.id_panier == cart.id_panier)
        .all()
    )
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    order_items: list[schemas.OrderItemOut] = []
    total = 0.0
    for it in items:
        product = db.query(models.Produit).get(it.id_produit)
        if not product:
            continue
        quantity = it.quantite_stock or 0
        unit_price = float(product.prix or 0)
        line_total = unit_price * quantity
        order_items.append(
            schemas.OrderItemOut(
                id_produit=it.id_produit, quantite=quantity, prix=unit_price
            )
        )
        total += line_total
        # reduce stock
        if product.stock is not None:
            product.stock = max(0, (product.stock or 0) - quantity)

    # Insert lines into Commande table (one row per product)
    for oi in order_items:
        db.add(models.Commande(
            id_users=user_id,
            id_produit=oi.id_produit,
            quantite=oi.quantite,
            prix_unitaire=oi.prix,
        ))

    # Clear only this cart's items
    for it in items:
        db.delete(it)

    db.commit()
    return schemas.OrderOut(id_users=user_id, items=order_items, prix_total=total)


# Admin CRUD pour Catégories (endpoints complets)
@router.put("/categories/{id_categorie}", response_model=schemas.CategorieOut)
def update_category(
    id_categorie: int,
    category_data: schemas.CategorieUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    category = db.query(models.Categorie).get(id_categorie)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    return category


@router.delete("/categories/{id_categorie}")
def delete_category(
    id_categorie: int,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    category = db.query(models.Categorie).get(id_categorie)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(category)
    db.commit()
    return {"message": "Category deleted"}


# Admin CRUD pour Marques (endpoints complets)
@router.put("/brands/{id_marque}", response_model=schemas.MarqueOut)
def update_brand(
    id_marque: int,
    brand_data: schemas.MarqueUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    brand = db.query(models.Marque).get(id_marque)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    update_data = brand_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(brand, field, value)
    
    db.commit()
    db.refresh(brand)
    return brand


@router.delete("/brands/{id_marque}")
def delete_brand(
    id_marque: int,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    brand = db.query(models.Marque).get(id_marque)
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    db.delete(brand)
    db.commit()
    return {"message": "Brand deleted"}


