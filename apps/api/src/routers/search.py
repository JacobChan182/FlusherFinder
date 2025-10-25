from fastapi import APIRouter, Query, Depends
from src.services.geosearch import search_nearby


router = APIRouter(prefix="/search", tags=["search"])


@router.get("/nearby")
def nearby(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: int = 1500,
    min_rating: float = 0.0,
    limit: int = 50,
    offset: int = 0,
):
    return search_nearby(lat, lng, radius, min_rating, limit, offset)