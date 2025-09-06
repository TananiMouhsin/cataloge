from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from .routers import router as api_router
from .database import engine
from . import models

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


@app.on_event("startup")
def on_startup():
    # Auto-create tables for SQLite (and others if desired)
    models.Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
