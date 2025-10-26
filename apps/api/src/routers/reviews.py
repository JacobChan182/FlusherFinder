from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select
from src.db import get_db
from src.core.dependencies import get_current_user
from src.schemas.review import ReviewCreate, ReviewOut
from src.models import Review, Washroom


router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.post("/", response_model=ReviewOut)
def create_review(payload: ReviewCreate, db: Session = Depends(get_db), user=Depends(get_current_user)):
    if not db.get(Washroom, payload.washroom_id):
        raise HTTPException(status_code=404, detail="Washroom not found")
    existing = db.scalars(select(Review).where(Review.washroom_id==payload.washroom_id).where(Review.user_id==user.id)).first()
    if existing:
        raise HTTPException(status_code=400, detail="You already reviewed this washroom")
    r = Review(
        washroom_id=payload.washroom_id,
        user_id=user.id,
        rating=payload.rating,
        comment=payload.comment
    )
    db.add(r); db.commit(); db.refresh(r)
    return ReviewOut(id=r.id, washroom_id=r.washroom_id, user_id=r.user_id, rating=r.rating, comment=r.comment)


@router.get("/by-washroom/{washroom_id}")
def list_reviews(washroom_id: str, db: Session = Depends(get_db)):
    rows = db.scalars(select(Review).where(Review.washroom_id==washroom_id)).all()
    return [ReviewOut(id=r.id, washroom_id=r.washroom_id, user_id=r.user_id, rating=r.rating, comment=r.comment) for r in rows]