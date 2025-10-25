from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import washrooms, reviews

app = FastAPI(title="FlushFinder API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ping")
def ping():
    return {"ok": True}

app.include_router(washrooms.router, prefix="/v1/washrooms", tags=["washrooms"])
app.include_router(reviews.router, prefix="/v1/reviews", tags=["reviews"])
