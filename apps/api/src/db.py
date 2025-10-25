from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from src.core.config import settings

class Base(DeclarativeBase):
    pass

# DEV ONLY: ensure tables exist (remove once using Alembic migrations)
# from src.db import Base, engine
# Base.metadata.create_all(bind=engine)

DATABASE_URL = str(settings.DATABASE_URL)

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()