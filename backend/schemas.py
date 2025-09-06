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
    id_produit: str
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
    id_produit: str
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


