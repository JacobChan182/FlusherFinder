from pydantic import BaseModel, Field
from typing import List


class WashroomCreate(BaseModel):
    name: str
    address: str | None = None
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    city: str | None = None
    is_public: bool = True
    price: str | None = None
    amenities: List[str] = [] # amenity codes


class WashroomOut(BaseModel):
    id: str
    name: str
    address: str | None = None
    lat: float
    lng: float
    avgRating: float | None = None
    ratingCount: int | None = None
    amenities: list[str] = []