-- Initialize FlushFinder Database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restrooms table
CREATE TABLE IF NOT EXISTS restrooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    location GEOMETRY(POINT, 4326),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    is_public BOOLEAN DEFAULT TRUE,
    is_accessible BOOLEAN DEFAULT FALSE,
    has_changing_table BOOLEAN DEFAULT FALSE,
    has_paper BOOLEAN DEFAULT FALSE,
    has_soap BOOLEAN DEFAULT FALSE,
    has_hand_dryer BOOLEAN DEFAULT FALSE,
    is_clean BOOLEAN DEFAULT NULL,
    hours_of_operation TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create spatial index for location
CREATE INDEX IF NOT EXISTS idx_restrooms_location ON restrooms USING GIST (location);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restroom_id UUID NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    accessibility_rating INTEGER CHECK (accessibility_rating >= 1 AND accessibility_rating <= 5),
    comment TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(restroom_id, user_id)
);

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restroom_id UUID NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, restroom_id)
);

-- Insert sample data
INSERT INTO users (email, username, password_hash, first_name, last_name) VALUES
('admin@flushfinder.com', 'admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HSf.8K2', 'Admin', 'User'),
('test@example.com', 'testuser', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/HSf.8K2', 'Test', 'User');

-- Insert sample restrooms
INSERT INTO restrooms (name, description, latitude, longitude, location, address, city, state, country, is_public, is_accessible, has_changing_table, has_paper, has_soap, has_hand_dryer, is_clean) VALUES
('Central Park Restroom', 'Clean public restroom in Central Park', 40.7829, -73.9654, ST_SetSRID(ST_MakePoint(-73.9654, 40.7829), 4326), 'Central Park, New York, NY', 'New York', 'NY', 'USA', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE),
('Times Square Station', 'Subway station restroom', 40.7580, -73.9855, ST_SetSRID(ST_MakePoint(-73.9855, 40.7580), 4326), 'Times Square, New York, NY', 'New York', 'NY', 'USA', TRUE, FALSE, FALSE, TRUE, FALSE, TRUE, FALSE),
('McDonald''s Downtown', 'Fast food restaurant restroom', 40.7505, -73.9934, ST_SetSRID(ST_MakePoint(-73.9934, 40.7505), 4326), '123 Broadway, New York, NY', 'New York', 'NY', 'USA', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE);

-- Insert sample reviews
INSERT INTO reviews (restroom_id, user_id, rating, cleanliness_rating, accessibility_rating, comment) VALUES
((SELECT id FROM restrooms WHERE name = 'Central Park Restroom'), (SELECT id FROM users WHERE username = 'testuser'), 5, 5, 5, 'Very clean and accessible!'),
((SELECT id FROM restrooms WHERE name = 'Times Square Station'), (SELECT id FROM users WHERE username = 'testuser'), 2, 2, 1, 'Not very clean and not accessible'),
((SELECT id FROM restrooms WHERE name = 'McDonald''s Downtown'), (SELECT id FROM users WHERE username = 'testuser'), 4, 4, 4, 'Good for a quick stop');
