from fastapi import APIRouter, Depends
from pydantic import BaseModel, conint
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.core.config import settings

router = APIRouter()

class ReviewCreate(BaseModel):
    washroom_id: str
    rating: conint(ge=1, le=5)
    text: str | None = None

@router.post("")
def create_review(payload: ReviewCreate, db: Session = Depends(get_db)):
    user_id = "00000000-0000-0000-0000-000000000001"  # TODO: replace with auth user

    db.execute(text("""
        INSERT INTO reviews (user_id, washroom_id, rating, text)
        VALUES (:user_id, :washroom_id, :rating, :text)
        ON CONFLICT (user_id, washroom_id) DO UPDATE
          SET rating = EXCLUDED.rating, text = EXCLUDED.text
    """), dict(user_id=user_id, washroom_id=payload.washroom_id, rating=payload.rating, text=payload.text))

    C, m = settings.BAYES_C, 3.8  # global mean placeholder
    db.execute(text("""
      UPDATE washroom_stats s
      SET ratings_count = sub.cnt,
          ratings_sum   = sub.sum,
          bayes_score   = (:C * :m + sub.sum)::float / (:C + sub.cnt),
          last_review_at = now()
      FROM (
        SELECT washroom_id, COUNT(*)::int AS cnt, COALESCE(SUM(rating),0)::int AS sum
        FROM reviews WHERE washroom_id = :wid GROUP BY washroom_id
      ) sub
      WHERE s.washroom_id = sub.washroom_id
    """), {"C": C, "m": m, "wid": payload.washroom_id})

    db.commit()
    return {"ok": True}
