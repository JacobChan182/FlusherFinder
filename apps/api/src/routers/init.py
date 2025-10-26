from fastapi import APIRouter, HTTPException
from sqlalchemy import text
from src.db import get_db

router = APIRouter(prefix="/init", tags=["init"])


@router.post("/database")
def init_database():
    """
    Initialize database tables (washrooms, amenities, etc.)
    This endpoint can be called to set up the database schema.
    """
    try:
        db = next(get_db())
        
        # Create washrooms table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS washrooms (
                id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
                name VARCHAR(200) NOT NULL,
                description TEXT,
                address VARCHAR(300),
                latitude DOUBLE PRECISION NOT NULL,
                longitude DOUBLE PRECISION NOT NULL,
                city VARCHAR(100),
                is_public BOOLEAN NOT NULL DEFAULT true,
                price VARCHAR(50),
                created_by VARCHAR(36),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        # Create amenities table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS amenities (
                code VARCHAR(50) PRIMARY KEY,
                label VARCHAR(120) NOT NULL
            )
        """))
        
        # Create washroom_amenities join table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS washroom_amenities (
                washroom_id VARCHAR(36) REFERENCES washrooms(id) ON DELETE CASCADE,
                amenity_code VARCHAR(50) REFERENCES amenities(code) ON DELETE CASCADE,
                PRIMARY KEY (washroom_id, amenity_code)
            )
        """))
        
        # Create reviews table
        db.execute(text("""
            CREATE TABLE IF NOT EXISTS reviews (
                id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
                washroom_id VARCHAR(36) REFERENCES washrooms(id) ON DELETE CASCADE,
                user_id VARCHAR(36) NOT NULL,
                rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                photos JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        """))
        
        # Create index
        db.execute(text("""
            CREATE INDEX IF NOT EXISTS ix_amenities_code ON amenities(code)
        """))
        
        db.commit()
        
        # Verify tables were created
        result = db.execute(text("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
              AND table_name IN ('washrooms', 'amenities', 'washroom_amenities')
        """)).fetchall()
        
        tables_created = [row[0] for row in result]
        
        return {
            "status": "success",
            "message": "Database tables initialized successfully",
            "tables_created": tables_created
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error initializing database: {str(e)}")
    finally:
        db.close()
