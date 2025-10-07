from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from .database import get_db
from . import models, schemas, security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from datetime import datetime
import os
import uuid
from fastapi.staticfiles import StaticFiles


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


@router.post("/upload-image")
def upload_image(
    file: UploadFile = File(...),
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    
    # Create uploads directory if it doesn't exist
    upload_dir = "project/public/uploads/images"
    os.makedirs(upload_dir, exist_ok=True)
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(upload_dir, unique_filename)
    
    # Save file
    with open(file_path, "wb") as buffer:
        content = file.file.read()
        buffer.write(content)
    
    # Return the filename (not full path)
    return {"filename": unique_filename}


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


# Cart endpoints - per-user cart
@router.post("/cart/add")
def cart_add(
    item: schemas.CartAddItem,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    
    # Get the most recent active cart for this user, or create a new one
    cart = db.query(models.Panier).filter(models.Panier.id_users == user_id).order_by(models.Panier.id_panier.desc()).first()
    if not cart:
        cart = models.Panier(id_users=user_id, date_creation=datetime.utcnow())
        db.add(cart)
        db.commit()
        db.refresh(cart)
    
    # Check if this product already exists in the cart
    stock = (
        db.query(models.Stocker)
        .filter(
            models.Stocker.id_panier == cart.id_panier,
            models.Stocker.id_produit == item.id_produit,
        )
        .first()
    )
    
    if stock:
        # Update existing item quantity
        stock.quantite_stock = (stock.quantite_stock or 0) + max(1, item.quantite)
        stock.date_mise_a_jour = datetime.utcnow()
    else:
        # Add new item to cart
        stock = models.Stocker(
            id_panier=cart.id_panier,
            id_produit=item.id_produit,
            quantite_stock=max(1, item.quantite),
            date_mise_a_jour=datetime.utcnow(),
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
    # Get the single active cart for this user (most recent one if multiple exist)
    cart = db.query(models.Panier).filter(models.Panier.id_users == user_id).order_by(models.Panier.id_panier.desc()).first()
    if not cart:
        return schemas.CartOut(id_panier=0, id_users=user_id, items=[], date_creation=None)
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
                id_produit=i.id_produit,
                quantite=i.quantite_stock or 0,
                date_mise_a_jour=i.date_mise_a_jour,
            )
            for i in items
        ],
        date_creation=cart.date_creation,
    )


@router.post("/cart/clear")
def clear_cart(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    cart = db.query(models.Panier).filter(models.Panier.id_users == user_id).order_by(models.Panier.id_panier.desc()).first()
    if not cart:
        return {"ok": True}
    
    # Delete all stocker items for this cart
    items = (
        db.query(models.Stocker)
        .filter(models.Stocker.id_panier == cart.id_panier)
        .all()
    )
    for it in items:
        db.delete(it)
    
    # Delete the cart itself
    db.delete(cart)
    db.commit()
    return {"ok": True}

@router.get("/carts", response_model=list[schemas.CartOut])
def get_user_carts(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    
    # Get all carts for this user
    carts = db.query(models.Panier).filter(models.Panier.id_users == user_id).order_by(models.Panier.id_panier.desc()).all()
    results: list[schemas.CartOut] = []
    
    for cart in carts:
        items = (
            db.query(models.Stocker)
            .filter(models.Stocker.id_panier == cart.id_panier)
            .all()
        )
        results.append(
            schemas.CartOut(
                id_panier=cart.id_panier,
                id_users=cart.id_users,
                items=[
                    schemas.CartItemOut(
                        id_produit=i.id_produit,
                        quantite=i.quantite_stock or 0,
                        date_mise_a_jour=i.date_mise_a_jour,
                    )
                    for i in items
                ],
                date_creation=cart.date_creation,
            )
        )
    return results

@router.post("/cart/new")
def create_new_cart(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    
    # Create a new cart for this user
    cart = models.Panier(id_users=user_id, date_creation=datetime.utcnow())
    db.add(cart)
    db.commit()
    db.refresh(cart)
    
    return {"ok": True, "cart_id": cart.id_panier}

@router.delete("/cart/{cart_id}")
def delete_cart(
    cart_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    
    # Verify the cart belongs to this user
    cart = db.query(models.Panier).filter(
        models.Panier.id_panier == cart_id,
        models.Panier.id_users == user_id
    ).first()
    
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Delete all stocker items for this cart
    items = (
        db.query(models.Stocker)
        .filter(models.Stocker.id_panier == cart.id_panier)
        .all()
    )
    for it in items:
        db.delete(it)
    
    # Delete the cart itself
    db.delete(cart)
    db.commit()
    return {"ok": True}


@router.post("/cart/{cart_id}/add")
def add_to_specific_cart(
    cart_id: int,
    item: schemas.CartAddItem,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    
    # Verify the cart belongs to the user
    cart = db.query(models.Panier).filter(
        models.Panier.id_panier == cart_id,
        models.Panier.id_users == user_id
    ).first()
    
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Check if this product already exists in the cart
    stock = (
        db.query(models.Stocker)
        .filter(
            models.Stocker.id_panier == cart_id,
            models.Stocker.id_produit == item.id_produit
        )
        .first()
    )
    
    if stock:
        # Update existing quantity
        stock.quantite_stock += item.quantite
        stock.date_mise_a_jour = datetime.utcnow()
    else:
        # Create new stock entry
        stock = models.Stocker(
            id_panier=cart_id,
            id_produit=item.id_produit,
            quantite_stock=item.quantite,
            date_mise_a_jour=datetime.utcnow()
        )
        db.add(stock)
    
    db.commit()
    return {"message": "Item added to cart successfully"}


@router.get("/cart/{cart_id}", response_model=schemas.CartOut)
def get_specific_cart(
    cart_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    
    # Verify the cart belongs to the user
    cart = db.query(models.Panier).filter(
        models.Panier.id_panier == cart_id,
        models.Panier.id_users == user_id
    ).first()
    
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    items = (
        db.query(models.Stocker)
        .filter(models.Stocker.id_panier == cart_id)
        .all()
    )
    
    return schemas.CartOut(
        id_panier=cart.id_panier,
        id_users=user_id,
        items=[
            schemas.CartItemOut(
                id_produit=item.id_produit,
                quantite=item.quantite_stock,
                date_mise_a_jour=item.date_mise_a_jour
            )
            for item in items
        ],
        date_creation=cart.date_creation
    )


@router.post("/cart/{cart_id}/clear")
def clear_specific_cart(
    cart_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    
    # Verify the cart belongs to the user
    cart = db.query(models.Panier).filter(
        models.Panier.id_panier == cart_id,
        models.Panier.id_users == user_id
    ).first()
    
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Delete all stocker items for this cart
    db.query(models.Stocker).filter(models.Stocker.id_panier == cart_id).delete()
    db.commit()
    
    return {"message": "Cart cleared successfully"}


@router.post("/cart/{cart_id}/order")
def create_order_from_cart(
    cart_id: int,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    
    # Verify the cart belongs to the user
    cart = db.query(models.Panier).filter(
        models.Panier.id_panier == cart_id,
        models.Panier.id_users == user_id
    ).first()
    
    if not cart:
        raise HTTPException(status_code=404, detail="Cart not found")
    
    # Get all items in the cart
    items = db.query(models.Stocker).filter(models.Stocker.id_panier == cart_id).all()
    
    if not items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    # Create orders for each item (include unit price when available)
    orders = []
    for item in items:
        prod = db.query(models.Produit).get(item.id_produit)
        unit_price = float(prod.prix) if prod and prod.prix is not None else 0.0
        order = models.Commande(
            id_users=user_id,
            id_produit=item.id_produit,
            quantite=item.quantite_stock,
            prix_unitaire=unit_price,
            statut="pending",
            date_commande=datetime.utcnow()
        )
        orders.append(order)
        db.add(order)
    
    # Clear the cart after creating orders
    db.query(models.Stocker).filter(models.Stocker.id_panier == cart_id).delete()
    db.delete(cart)
    
    db.commit()
    # Persist creations and deletions
    db.commit()
    return {"message": f"Order created successfully with {len(orders)} items"}

@router.post("/orders", response_model=schemas.OrderOut)
def create_order(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    user_id = int(payload["sub"]) if isinstance(payload.get("sub"), str) else payload.get("sub")
    # Get the single active cart for this user (most recent one if multiple exist)
    cart = db.query(models.Panier).filter(models.Panier.id_users == user_id).order_by(models.Panier.id_panier.desc()).first()
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
        if product.stock is not None:
            product.stock = max(0, (product.stock or 0) - quantity)
    for oi in order_items:
        db.add(models.Commande(
            id_users=user_id,
            id_produit=oi.id_produit,
            quantite=oi.quantite,
            prix_unitaire=oi.prix,
            statut=models.OrderStatus.pending,
            date_commande=datetime.utcnow(),
        ))
    # Clear cart items after order creation so client cart is empty
    for it in items:
        try:
            db.delete(it)
        except Exception:
            pass
    db.commit()
    return schemas.OrderOut(id_users=user_id, items=order_items, prix_total=total)


# Admin: list all order rows
@router.get("/orders", response_model=list[schemas.OrderRowOut])
def list_orders(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    """Admin: list all order rows.

    This endpoint is resilient to database schema differences. It first tries the
    canonical ORM model (with columns id_commande, prix_unitaire, date_commande, statut).
    If that fails (e.g., in an environment where the table columns are
    id_users, id_produit, quantite, prix, prix_total, date_creation with no id_commande/statut),
    it falls back to raw SQL and maps fields accordingly so the admin UI can still display orders.
    """
    payload = _require_auth(credentials)
    _require_admin(payload)

    out: list[schemas.OrderRowOut] = []

    try:
        # Preferred path: use ORM models matching the canonical schema
        rows = db.query(models.Commande).all()
        for r in rows:
            prod = db.query(models.Produit).get(r.id_produit)
            status_value = None
            if getattr(r, "statut", None) is not None:
                raw = r.statut.value if hasattr(r.statut, "value") else str(r.statut)
                status_value = raw.capitalize()
            out.append(schemas.OrderRowOut(
                id_commande=getattr(r, "id_commande", None) or 0,
                id_users=r.id_users,
                id_produit=r.id_produit,
                quantite=r.quantite or 0,
                prix_unitaire=float(getattr(r, "prix_unitaire", 0) or 0),
                date_commande=getattr(r, "date_commande", None),
                nom_produit=prod.nom if prod else None,
                statut=status_value,
            ))
        return out
    except Exception:
        # Fallback: raw SQL mapping for alternate schema
        pass

    # Fallback path: attempt to read from a schema with columns:
    # id_users, id_produit (may be TEXT), quantite, prix (unitaire), prix_total, date_creation
    from sqlalchemy import text

    for tbl in ("Commande", "commande"):
        try:
            rows = db.execute(text(
                f"""
                SELECT 
                  id_users, 
                  id_produit, 
                  quantite, 
                  COALESCE(prix_unitaire, prix) AS prix_unitaire, 
                  COALESCE(date_commande, date_creation) AS date_commande,
                  statut
                FROM {tbl}
                """
            )).mappings()
            synthetic_id = 1
            for r in rows:
                # Try to fetch product name from Produit table regardless of id type
                prod_name = None
                try:
                    prod_row = db.execute(text("SELECT nom FROM Produit WHERE id_produit = :pid"), {"pid": r["id_produit"]}).first()
                    if not prod_row:
                        prod_row = db.execute(text("SELECT nom FROM produit WHERE id_produit = :pid"), {"pid": r["id_produit"]}).first()
                    if prod_row:
                        prod_name = prod_row[0]
                except Exception:
                    prod_name = None

                statut_val = r.get("statut")
                statut_out = None
                if statut_val is not None:
                    s = str(statut_val)
                    statut_out = s[:1].upper() + s[1:].lower()
                out.append(schemas.OrderRowOut(
                    id_commande=synthetic_id,
                    id_users=r.get("id_users"),
                    id_produit=r.get("id_produit"),
                    quantite=r.get("quantite") or 0,
                    prix_unitaire=float(r.get("prix_unitaire") or 0),
                    date_commande=r.get("date_commande"),
                    nom_produit=prod_name,
                    statut=statut_out,
                ))
                synthetic_id += 1
            return out
        except Exception:
            continue
    # As a last resort, return empty list rather than failing the admin UI
    return []


@router.put("/orders/{id_commande}/status", response_model=schemas.OrderRowOut)
def update_order_status(
    id_commande: int,
    payload_in: schemas.OrderStatusUpdate,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    # Try ORM by primary key; if schema doesn't declare primary key, fallback to filter
    row = db.query(models.Commande).get(id_commande)
    if not row:
        row = db.query(models.Commande).filter(getattr(models.Commande, "id_commande") == id_commande).first()
    if not row:
        # As a last resort, try raw SQL update/select for legacy schemas
        from sqlalchemy import text
        valid = {"pending", "completed", "canceled"}
        incoming = (payload_in.statut or "").lower()
        if incoming not in valid:
            raise HTTPException(status_code=400, detail="Invalid status")
        try:
            db.execute(text("UPDATE Commande SET statut = :s WHERE id_commande = :id"), {"s": incoming, "id": id_commande})
            db.commit()
            # Fetch fields for response
            rec = db.execute(text("SELECT id_users, id_produit, quantite, prix AS prix_unitaire, date_creation FROM Commande WHERE id_commande = :id"), {"id": id_commande}).first()
            if not rec:
                raise HTTPException(status_code=404, detail="Order not found")
            # Get product name if possible
            prod_name = None
            try:
                p = db.execute(text("SELECT nom FROM Produit WHERE id_produit = :pid"), {"pid": rec["id_produit"]}).first()
                if p:
                    prod_name = p[0]
            except Exception:
                prod_name = None
            return schemas.OrderRowOut(
                id_commande=id_commande,
                id_users=rec["id_users"],
                id_produit=rec["id_produit"],
                quantite=rec["quantite"] or 0,
                prix_unitaire=float(rec["prix_unitaire"] or 0),
                date_commande=rec["date_creation"],
                nom_produit=prod_name,
                statut=incoming.capitalize(),
            )
        except HTTPException:
            raise
        except Exception:
            raise HTTPException(status_code=500, detail="Failed to update status")
    # Validate status (case-insensitive)
    valid = {"pending", "completed", "canceled"}
    incoming = (payload_in.statut or "").lower()
    if incoming not in valid:
        raise HTTPException(status_code=400, detail="Invalid status")
    row.statut = models.OrderStatus(incoming)
    db.commit()
    prod = db.query(models.Produit).get(row.id_produit)
    return schemas.OrderRowOut(
        id_commande=row.id_commande,
        id_users=row.id_users,
        id_produit=row.id_produit,
        quantite=row.quantite or 0,
        prix_unitaire=float(row.prix_unitaire or 0),
        date_commande=row.date_commande,
        nom_produit=prod.nom if prod else None,
        statut=row.statut.value.capitalize(),
    )


@router.get("/orders-all", response_model=list[schemas.OrderRowOut])
def list_orders_public(db: Session = Depends(get_db)):
    out: list[schemas.OrderRowOut] = []
    from sqlalchemy import text
    # Prefer explicit select from lowercase `commande` matching provided schema
    try:
        rows = db.execute(text(
            """
            SELECT id_commande,id_users,id_produit,quantite,prix_unitaire,date_commande,statut
            FROM commande
            ORDER BY id_commande DESC
            """
        )).mappings()
        for r in rows:
            # Fetch product name (handles both Produit/produit)
            prod_name = None
            try:
                p = db.execute(text("SELECT nom FROM Produit WHERE id_produit = :pid"), {"pid": r.get("id_produit")}).first()
                if not p:
                    p = db.execute(text("SELECT nom FROM produit WHERE id_produit = :pid"), {"pid": r.get("id_produit")}).first()
                if p:
                    prod_name = p[0]
            except Exception:
                prod_name = None
            statut_val = r.get("statut")
            statut_out = None
            if statut_val is not None:
                s = str(statut_val)
                statut_out = s[:1].upper() + s[1:].lower()
            out.append(schemas.OrderRowOut(
                id_commande=int(r.get("id_commande") or 0),
                id_users=int(r.get("id_users") or 0),
                id_produit=r.get("id_produit"),
                quantite=int(r.get("quantite") or 0),
                prix_unitaire=float(r.get("prix_unitaire") or 0),
                date_commande=r.get("date_commande"),
                nom_produit=prod_name,
                statut=statut_out,
            ))
        return out
    except Exception:
        pass

    # Fallback to ORM/all-caps if needed
    try:
        rows = db.query(models.Commande).all()
        for r in rows:
            prod = db.query(models.Produit).get(r.id_produit)
            status_value = None
            if getattr(r, "statut", None) is not None:
                raw = r.statut.value if hasattr(r.statut, "value") else str(r.statut)
                status_value = raw.capitalize()
            out.append(schemas.OrderRowOut(
                id_commande=getattr(r, "id_commande", None) or 0,
                id_users=r.id_users,
                id_produit=r.id_produit,
                quantite=r.quantite or 0,
                prix_unitaire=float(getattr(r, "prix_unitaire", 0) or 0),
                date_commande=getattr(r, "date_commande", None),
                nom_produit=prod.nom if prod else None,
                statut=status_value,
            ))
        return out
    except Exception:
        return []


@router.get("/admin/carts", response_model=list[schemas.CartOut])
def admin_list_carts(
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    carts = db.query(models.Panier).all()
    results: list[schemas.CartOut] = []
    for cart in carts:
        items = (
            db.query(models.Stocker)
            .filter(models.Stocker.id_panier == cart.id_panier)
            .all()
        )
        results.append(
            schemas.CartOut(
                id_panier=cart.id_panier,
                id_users=cart.id_users,
                items=[
                    schemas.CartItemOut(
                        id_produit=i.id_produit,
                        quantite=i.quantite_stock or 0,
                        date_mise_a_jour=i.date_mise_a_jour,
                    )
                    for i in items
                ],
                date_creation=cart.date_creation,
            )
        )
    return results


# Contact: send message to all admins (basic placeholder - logs emails)
@router.post("/contact")
def send_contact(payload: schemas.ContactMessage, db: Session = Depends(get_db)):
    # Collect admin emails
    admins = db.query(models.Utilisateurs).filter(models.Utilisateurs.role == models.UserRole.admin).all()
    emails = [a.email for a in admins if a.email]
    # In a real app, send emails here (SMTP). For now, just return success with recipients.
    # You can configure SMTP later; endpoint stays the same for the frontend.
    return {
        "ok": True,
        "sent_to": emails,
    }

# Debug endpoints to quickly verify DB connectivity and data presence
@router.get("/debug/orders-count")
def debug_orders_count(db: Session = Depends(get_db)):
    try:
        from sqlalchemy import text
        count = db.execute(text("SELECT COUNT(*) AS c FROM commande")).mappings().first()
        return {"ok": True, "table": "commande", "count": int(count["c"]) if count else 0}
    except Exception as e:
        return {"ok": False, "error": str(e)}

@router.get("/debug/orders-sample")
def debug_orders_sample(db: Session = Depends(get_db)):
    try:
        from sqlalchemy import text
        rows = db.execute(text(
            "SELECT id_commande,id_users,id_produit,quantite,prix_unitaire,date_commande,statut FROM commande ORDER BY id_commande DESC LIMIT 5"
        )).mappings()
        out = []
        for r in rows:
            out.append({
                "id_commande": r.get("id_commande"),
                "id_users": r.get("id_users"),
                "id_produit": r.get("id_produit"),
                "quantite": r.get("quantite"),
                "prix_unitaire": float(r.get("prix_unitaire") or 0),
                "date_commande": str(r.get("date_commande")),
                "statut": r.get("statut"),
            })
        return {"ok": True, "rows": out}
    except Exception as e:
        return {"ok": False, "error": str(e)}


@router.get("/users-count")
def users_count(db: Session = Depends(get_db)):
    """Return total number of registered users.

    Public endpoint to keep the admin dashboard simple even if auth header is missing.
    """
    try:
        total = db.query(models.Utilisateurs).count()
        return {"count": int(total)}
    except Exception:
        # Fallback using raw SQL for varying table name casing
        try:
            from sqlalchemy import text
            row = db.execute(text("SELECT COUNT(*) AS c FROM Utilisateurs")).mappings().first()
            if not row:
                row = db.execute(text("SELECT COUNT(*) AS c FROM utilisateurs")).mappings().first()
            return {"count": int(row["c"]) if row else 0}
        except Exception:
            return {"count": 0}
