from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .database import get_db
from . import models, schemas, security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


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
    user = models.Utilisateurs(
        nom=payload.nom,
        email=payload.email,
        mdp_hash=security.hash_password(payload.password),
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


@router.get("/auth/me")
def me(credentials: HTTPAuthorizationCredentials = Depends(auth_scheme), db: Session = Depends(get_db)):
    payload = _require_auth(credentials)
    user_id = int(payload.get("sub"))
    user = db.query(models.Utilisateurs).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    role = user.role.value if hasattr(user.role, "value") else str(user.role)
    return {"user_id": user.id_users, "nom": user.nom, "email": user.email, "role": role}


# Read-only lists
@router.get("/categories", response_model=list[schemas.CategorieOut])
def list_categories(db: Session = Depends(get_db)):
    return db.query(models.Categorie).all()


@router.get("/brands", response_model=list[schemas.MarqueOut])
def list_brands(db: Session = Depends(get_db)):
    return db.query(models.Marque).all()


@router.get("/products", response_model=list[schemas.ProduitWithDetails])
def list_products(db: Session = Depends(get_db)):
    return db.query(models.Produit).join(models.Categorie).join(models.Marque).all()


# Admin CRUD
@router.post("/products", response_model=schemas.ProduitOut)
def create_product(
    id_produit: str,
    id_categorie: int,
    id_marque: int,
    nom: str,
    prix: float,
    stock: int,
    description: str | None = None,
    qr_code_path: str | None = None,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    prod = models.Produit(
        id_produit=id_produit,
        id_categorie=id_categorie,
        id_marque=id_marque,
        nom=nom,
        description=description,
        prix=prix,
        stock=stock,
        qr_code_path=qr_code_path,
    )
    db.add(prod)
    db.commit()
    db.refresh(prod)
    return prod


@router.put("/products/{id_produit}", response_model=schemas.ProduitOut)
def update_product(
    id_produit: str,
    nom: str | None = None,
    description: str | None = None,
    prix: float | None = None,
    stock: int | None = None,
    id_categorie: int | None = None,
    id_marque: int | None = None,
    credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
    db: Session = Depends(get_db),
):
    payload = _require_auth(credentials)
    _require_admin(payload)
    prod = db.query(models.Produit).get(id_produit)
    if not prod:
        raise HTTPException(status_code=404, detail="Product not found")
    if nom is not None:
        prod.nom = nom
    if description is not None:
        prod.description = description
    if prix is not None:
        prod.prix = prix
    if stock is not None:
        prod.stock = stock
    if id_categorie is not None:
        prod.id_categorie = id_categorie
    if id_marque is not None:
        prod.id_marque = id_marque
    db.commit()
    db.refresh(prod)
    return prod


@router.delete("/products/{id_produit}")
def delete_product(
    id_produit: str,
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
def create_category(nom: str, credentials: HTTPAuthorizationCredentials = Depends(auth_scheme), db: Session = Depends(get_db)):
    payload = _require_auth(credentials)
    _require_admin(payload)
    cat = models.Categorie(nom=nom)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


@router.post("/brands", response_model=schemas.MarqueOut)
def create_brand(nom: str, credentials: HTTPAuthorizationCredentials = Depends(auth_scheme), db: Session = Depends(get_db)):
    payload = _require_auth(credentials)
    _require_admin(payload)
    brand = models.Marque(nom=nom)
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


# Basic cart endpoints (placeholders)
@router.post("/cart/add")
def cart_add():
    return {"ok": True}


