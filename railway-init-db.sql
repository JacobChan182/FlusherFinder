-- Railway Database Initialization
-- This SQL creates the washrooms, amenities, and washroom_amenities tables

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

CREATE TABLE IF NOT EXISTS amenities (
    code VARCHAR(50) PRIMARY KEY,
    label VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS washroom_amenities (
    washroom_id VARCHAR(36) REFERENCES washrooms(id) ON DELETE CASCADE,
    amenity_code VARCHAR(50) REFERENCES amenities(code) ON DELETE CASCADE,
    PRIMARY KEY (washroom_id, amenity_code)
);

CREATE INDEX IF NOT EXISTS ix_amenities_code ON amenities(code);
