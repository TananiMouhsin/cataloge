import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv


load_dotenv()


def _build_db_url() -> str:
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    # Fallback to SQLite if no DATABASE_URL provided
    db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "catalogue.db"))
    return f"sqlite:///{db_path}"


DATABASE_URL = _build_db_url()

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, pool_pre_ping=True, connect_args=connect_args)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


