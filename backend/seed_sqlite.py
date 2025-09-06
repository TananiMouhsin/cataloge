from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models


def ensure_tables():
    models.Base.metadata.create_all(bind=engine)


def seed():
    ensure_tables()
    db: Session = SessionLocal()
    try:
        if db.query(models.Categorie).count() == 0:
            cats = [models.Categorie(nom=n) for n in ["Électronique", "Mode", "Maison", "Sports"]]
            db.add_all(cats)
            db.flush()

        if db.query(models.Marque).count() == 0:
            brands = [models.Marque(nom=n) for n in ["Apple", "Samsung", "Nike", "Adidas", "IKEA"]]
            db.add_all(brands)
            db.flush()

        if db.query(models.Produit).count() == 0:
            # Simple sample products
            cats_map = {c.nom: c.id_categorie for c in db.query(models.Categorie).all()}
            brands_map = {b.nom: b.id_marque for b in db.query(models.Marque).all()}

            products = [
                models.Produit(
                    id_produit="P000000001",
                    nom="iPhone 15 Pro",
                    description="Le iPhone 15 Pro avec puce A17 Pro.",
                    prix=1199.00,
                    stock=10,
                    id_categorie=cats_map.get("Électronique"),
                    id_marque=brands_map.get("Apple"),
                ),
                models.Produit(
                    id_produit="P000000002",
                    nom="MacBook Air M3",
                    description="MacBook Air avec la puce M3.",
                    prix=1499.00,
                    stock=5,
                    id_categorie=cats_map.get("Électronique"),
                    id_marque=brands_map.get("Apple"),
                ),
                models.Produit(
                    id_produit="P000000003",
                    nom="Nike Air Max 270",
                    description="Baskets Nike Air Max 270.",
                    prix=149.00,
                    stock=20,
                    id_categorie=cats_map.get("Sports"),
                    id_marque=brands_map.get("Nike"),
                ),
            ]
            db.add_all(products)

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed()


