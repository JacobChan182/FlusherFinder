from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from src.db import get_db
from src.models import Washroom, Amenity
from src.schemas.washroom import WashroomCreate, WashroomOut
from src.core.dependencies import get_current_user


router = APIRouter(prefix="/washrooms", tags=["washrooms"])


@router.post("/", response_model=WashroomOut)
def create_washroom(payload: WashroomCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    w = Washroom(name=payload.name, address=payload.address, latitude=payload.lat, longitude=payload.lng, city=payload.city, is_public=payload.is_public, price=payload.price, created_by=user.id)
    if payload.amenities:
        ams = db.scalars(select(Amenity).where(Amenity.code.in_(payload.amenities))).all()
        w.amenities = list(ams)
    db.add(w); db.commit(); db.refresh(w)
    return WashroomOut(id=w.id, name=w.name, address=w.address, lat=w.latitude, lng=w.longitude, amenities=[a.code for a in w.amenities], avgRating=None, ratingCount=None)


@router.get("/{washroom_id}", response_model=WashroomOut)
def get_washroom(washroom_id: str, db: Session = Depends(get_db)):
    w = db.get(Washroom, washroom_id)
    if not w:
        raise HTTPException(status_code=404, detail="Not found")
    return WashroomOut(
        id=w.id, 
        name=w.name, 
        address=w.address, 
        lat=w.latitude, 
        lng=w.longitude, 
        amenities=[a.code for a in w.amenities],
        avgRating=None,
        ratingCount=None
    )