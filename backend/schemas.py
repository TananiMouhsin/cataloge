from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr


class CategorieOut(BaseModel):
    id_categorie: int
    nom: str

    class Config:
        from_attributes = True


class MarqueOut(BaseModel):
    id_marque: int
    nom: str

    class Config:
        from_attributes = True


class ProduitOut(BaseModel):
    id_produit: int
    id_categorie: int
    id_marque: int
    nom: str
    description: Optional[str] = None
    prix: float
    stock: int
    qr_code_path: Optional[str] = None
    date_creation: Optional[datetime] = None
    reste: Optional[int] = None

    class Config:
        from_attributes = True


class ProduitWithDetails(BaseModel):
    id_produit: int
    id_categorie: int
    id_marque: int
    nom: str
    description: Optional[str] = None
    prix: float
    stock: int
    qr_code_path: Optional[str] = None
    date_creation: Optional[datetime] = None
    reste: Optional[int] = None
    categorie: CategorieOut
    marque: MarqueOut

    class Config:
        from_attributes = True


# Auth schemas
class SignupRequest(BaseModel):
    nom: str
    email: EmailStr
    password: str
    role: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int
    nom: str
    email: EmailStr


class UserResponse(BaseModel):
    id_users: int
    nom: str
    email: EmailStr
    role: str

    class Config:
        from_attributes = True


class ProductCreate(BaseModel):
    id_categorie: int
    id_marque: int
    nom: str
    description: Optional[str] = None
    prix: float
    stock: int
    qr_code_path: Optional[str] = None


class ProductUpdate(BaseModel):
    nom: Optional[str] = None
    description: Optional[str] = None
    prix: Optional[float] = None
    stock: Optional[int] = None
    id_categorie: Optional[int] = None
    id_marque: Optional[int] = None
    qr_code_path: Optional[str] = None


class CategorieCreate(BaseModel):
    nom: str


class CategorieUpdate(BaseModel):
    nom: Optional[str] = None


class MarqueCreate(BaseModel):
    nom: str


class MarqueUpdate(BaseModel):
    nom: Optional[str] = None


# Cart and Orders schemas
class CartAddItem(BaseModel):
    id_produit: int
    quantite: int = 1


class CartItemOut(BaseModel):
    id_produit: int
    quantite: int
    date_mise_a_jour: Optional[datetime] = None


class CartOut(BaseModel):
    id_panier: int
    id_users: int
    items: list[CartItemOut]
    date_creation: Optional[datetime] = None


class OrderItemOut(BaseModel):
    id_produit: int
    quantite: int
    prix: float


class OrderOut(BaseModel):
    id_users: int
    items: list[OrderItemOut]
    prix_total: float
    date_creation: Optional[datetime] = None


class OrderRowOut(BaseModel):
    id_commande: int
    id_users: int
    id_produit: int
    quantite: int
    prix_unitaire: float
    date_commande: Optional[datetime] = None
    nom_produit: Optional[str] = None
    statut: Optional[str] = None


class OrderStatusUpdate(BaseModel):
    statut: str  # 'Pending' | 'Completed' | 'Canceled'


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    message: str

