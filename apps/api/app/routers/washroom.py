from fastapi import APIRouter, Depends, Query
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.db.base import get_db

router = APIRouter()

@router.get("/nearby")
def nearby(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: int = 1500,
    db: Session = Depends(get_db),
):
    sql = text("""
      SELECT w.id::text, w.name, w.address,
             ST_Distance(w.location, ST_SetSRID(ST_MakePoint(:lng,:lat),4326)::geography) AS distance_m,
             s.bayes_score, s.ratings_count
      FROM washrooms w
      JOIN washroom_stats s ON s.washroom_id = w.id
      WHERE ST_DWithin(
        w.location,
        ST_SetSRID(ST_MakePoint(:lng,:lat),4326)::geography,
        :radius
      )
      ORDER BY s.bayes_score DESC, distance_m ASC
      LIMIT 50;
    """)
    rows = db.execute(sql, {"lat": lat, "lng": lng, "radius": radius}).mappings().all()
    return rows
