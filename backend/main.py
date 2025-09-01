from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime
import uuid

# Initialize FastAPI app
app = FastAPI(
    title="Catalogue API",
    description="A FastAPI backend for the catalogue application",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev server ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Pydantic models
class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None
    stock: int = 0

class Product(ProductBase):
    id: str
    created_at: datetime
    updated_at: datetime

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    stock: Optional[int] = None

class User(BaseModel):
    id: str
    username: str
    email: str
    created_at: datetime

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class CartItem(BaseModel):
    product_id: str
    quantity: int

class Cart(BaseModel):
    user_id: str
    items: List[CartItem]
    total: float

# Database connection will be added here

# API Endpoints
# All endpoints have been removed

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
