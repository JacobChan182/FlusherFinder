-- Railway Washroom Schema
-- Run this in Railway PostgreSQL console to create washrooms and amenities tables

-- Create washrooms table (without PostGIS)
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
);

-- Create amenities table
CREATE TABLE IF NOT EXISTS amenities (
    code VARCHAR(50) PRIMARY KEY,
    label VARCHAR(120) NOT NULL
);

-- Create washroom_amenities join table
CREATE TABLE IF NOT EXISTS washroom_amenities (
    washroom_id VARCHAR(36) REFERENCES washrooms(id) ON DELETE CASCADE,
    amenity_code VARCHAR(50) REFERENCES amenities(code) ON DELETE CASCADE,
    PRIMARY KEY (washroom_id, amenity_code)
);

-- Create index
CREATE INDEX IF NOT EXISTS ix_amenities_code ON amenities(code);

-- Verify tables were created
SELECT 'Tables created successfully!' as status,
       COUNT(*) as total_tables
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('washrooms', 'amenities', 'washroom_amenities');
