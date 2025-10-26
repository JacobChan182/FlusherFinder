from sqlalchemy import text
from src.db import SessionLocal


def search_nearby(lat: float, lng: float, radius: int, min_rating: float, limit: int, offset: int):
    """
    Search nearby washrooms using latitude/longitude columns (no PostGIS required).
    Uses haversine formula for distance calculation.
    """
    sql = text(
        """
        WITH ra AS (
            SELECT w.id AS washroom_id, COALESCE(AVG(r.rating),0) AS avg_rating, COUNT(r.*) AS rating_count
            FROM washrooms w
            LEFT JOIN reviews r ON r.washroom_id = w.id
            GROUP BY w.id
        )
        SELECT w.id, w.name, w.address,
                w.latitude AS lat,
                w.longitude AS lng,
                ra.avg_rating AS "avgRating",
                ra.rating_count AS "ratingCount",
                -- Haversine formula to calculate distance in meters
                6371000 * acos(
                    LEAST(1.0, 
                        sin(radians(:lat)) * sin(radians(w.latitude)) + 
                        cos(radians(:lat)) * cos(radians(w.latitude)) * 
                        cos(radians(w.longitude - :lng))
                    )
                ) AS "distanceM"
        FROM washrooms w
        JOIN ra ON ra.washroom_id = w.id
        WHERE ra.avg_rating >= :min_rating
          -- Approximate distance check (using latitude/longitude degrees)
          AND (
            abs(w.latitude - :lat) * 111000 <= :radius AND
            abs(w.longitude - :lng) * 111000 <= :radius
          )
        ORDER BY "distanceM" ASC
        LIMIT :limit OFFSET :offset
        """
    )
    with SessionLocal() as s:
        rows = s.execute(sql, dict(lat=lat, lng=lng, radius=radius, min_rating=min_rating, limit=limit, offset=offset)).mappings().all()
        return [dict(r) for r in rows]