from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from .routers import router as api_router
from .database import engine
from . import models
from sqlalchemy import text
from sqlalchemy.orm import Session
import os

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

@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(api_router, prefix="")

# Mount static files for uploaded images
uploads_dir = "project/public/uploads"
if os.path.exists(uploads_dir):
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")


@app.on_event("startup")
def on_startup():
    # Auto-create tables for SQLite (and others if desired)
    models.Base.metadata.create_all(bind=engine)
    # Lightweight SQLite migration to support admin orders page on legacy schemas
    try:
        with engine.connect() as conn:
            # Detect existing columns on Commande
            cols = conn.execute(text("PRAGMA table_info(Commande)")).fetchall()
            col_names = {c[1].lower() for c in cols}

            # Add 'statut' column if missing
            if 'statut' not in col_names:
                conn.execute(text("ALTER TABLE Commande ADD COLUMN statut TEXT"))
                # Default existing rows to 'pending'
                conn.execute(text("UPDATE Commande SET statut = 'pending' WHERE statut IS NULL"))

            # Add 'id_commande' column if missing, backfill from rowid
            if 'id_commande' not in col_names:
                conn.execute(text("ALTER TABLE Commande ADD COLUMN id_commande INTEGER"))
                # Backfill using SQLite rowid for stable identifiers
                conn.execute(text("UPDATE Commande SET id_commande = rowid WHERE id_commande IS NULL"))
                # Create a unique index to mimic identifier behavior
                conn.execute(text("CREATE UNIQUE INDEX IF NOT EXISTS idx_commande_id ON Commande(id_commande)"))
            conn.commit()
    except Exception:
        # Do not block startup on optional migration
        pass

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
