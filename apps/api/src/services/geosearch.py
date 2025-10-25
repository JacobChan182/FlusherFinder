from sqlalchemy import text
from src.db import SessionLocal


def search_nearby(lat: float, lng: float, radius: int, min_rating: float, limit: int, offset: int):
    sql = text(
        """
        WITH ra AS (
            SELECT w.id AS washroom_id, COALESCE(AVG(r.rating),0) AS avg_rating, COUNT(r.*) AS rating_count
            FROM washrooms w
            LEFT JOIN reviews r ON r.washroom_id = w.id
            GROUP BY w.id
        )
        SELECT w.id, w.name, w.address,
                ST_Y(w.location::geometry) AS lat,
                ST_X(w.location::geometry) AS lng,
                ra.avg_rating AS "avgRating",
                ra.rating_count AS "ratingCount",
                ST_Distance(
                    w.location,
                    ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography
                ) AS "distanceM"
        FROM washrooms w
        JOIN ra ON ra.washroom_id = w.id
        WHERE ST_DWithin(
                w.location,
                ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
                :radius
            )
            AND ra.avg_rating >= :min_rating
        ORDER BY "distanceM" ASC
        LIMIT :limit OFFSET :offset
        """
    )
    with SessionLocal() as s:
        rows = s.execute(sql, dict(lat=lat, lng=lng, radius=radius, min_rating=min_rating, limit=limit, offset=offset)).mappings().all()
        return [dict(r) for r in rows]