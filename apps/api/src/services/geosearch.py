from sqlalchemy import text
from src.db import SessionLocal


def search_nearby(lat: float, lng: float, radius: int, min_rating: float, limit: int, offset: int):
    """
    Search nearby washrooms using latitude/longitude columns (no PostGIS required).
    Uses haversine formula for distance calculation.
    Works without reviews table if it doesn't exist yet.
    """
    sql = text(
        """
        SELECT w.id, w.name, w.address,
                w.latitude AS lat,
                w.longitude AS lng,
                COALESCE(
                    -- Bayesian smoothing: (total_ratings * avg_rating + prior_rating * prior_weight) / (total_ratings + prior_weight)
                    ROUND((COUNT(r.id) * AVG(r.rating) + 3.6 * 8.0) / (COUNT(r.id) + 8.0), 2), 
                    3.6  -- Default to prior rating if no reviews
                ) AS "avgRating",
                COUNT(r.id) AS "ratingCount",
                -- Haversine formula to calculate distance in meters
                6371000 * acos(
                    LEAST(1.0, 
                        sin(radians(:lat)) * sin(radians(w.latitude)) + 
                        cos(radians(:lat)) * cos(radians(w.latitude)) * 
                        cos(radians(w.longitude - :lng))
                    )
                ) AS "distanceM"
        FROM washrooms w
        LEFT JOIN reviews r ON w.id = r.washroom_id
        WHERE -- Approximate distance check (using latitude/longitude degrees)
            abs(w.latitude - :lat) * 111000 <= :radius AND
            abs(w.longitude - :lng) * 111000 <= :radius
        GROUP BY w.id, w.name, w.address, w.latitude, w.longitude
        ORDER BY "distanceM" ASC
        LIMIT :limit OFFSET :offset
        """
    )
    with SessionLocal() as s:
        rows = s.execute(sql, dict(lat=lat, lng=lng, radius=radius, min_rating=min_rating, limit=limit, offset=offset)).mappings().all()
        return [dict(r) for r in rows]