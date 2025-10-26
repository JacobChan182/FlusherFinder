from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import settings with error handling
try:
    from src.core.config import settings
except Exception as e:
    print(f"ERROR: Failed to load settings: {e}")
    print("Make sure DATABASE_URL and JWT_SECRET are set in environment variables")
    raise

from src.routers.auth import router as auth_router
from src.routers.washroom import router as washroom_router
from src.routers.reviews import router as reviews_router
from src.routers.search import router as search_router


app = FastAPI(title="Washroom Finder API", version="0.1.0")

from fastapi import Depends
from sqlalchemy import text
from src.db import get_db

@app.get("/health/db")
def health_db(db=Depends(get_db)):
    pg = db.execute(text("SELECT version()")).scalar()
    try:
        pgis = db.execute(text("SELECT PostGIS_Version()")).scalar()
    except Exception as e:
        pgis = f"ERROR: {e}"
    return {"postgres": pg, "postgis": pgis}


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS or ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(washroom_router)
app.include_router(reviews_router)
app.include_router(search_router)


@app.get("/")
def root():
    return {"status": "ok"}