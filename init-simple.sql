-- Simple database setup without PostGIS for now
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create restrooms table (without PostGIS geometry for now)
CREATE TABLE IF NOT EXISTS restrooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    accessibility_features JSONB, -- e.g., {"wheelchair_accessible": true, "gender_neutral": true}
    average_rating NUMERIC(2, 1),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restroom_id UUID NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restroom_id UUID NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, restroom_id) -- A user can favorite a restroom only once
);

-- Function to update restroom average rating and count
CREATE OR REPLACE FUNCTION update_restroom_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE restrooms
    SET
        average_rating = (SELECT AVG(rating) FROM reviews WHERE restroom_id = NEW.restroom_id),
        review_count = (SELECT COUNT(*) FROM reviews WHERE restroom_id = NEW.restroom_id)
    WHERE id = NEW.restroom_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new reviews
CREATE OR REPLACE TRIGGER trg_update_restroom_rating_insert
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restroom_rating();

-- Trigger for updated reviews
CREATE OR REPLACE TRIGGER trg_update_restroom_rating_update
AFTER UPDATE OF rating ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restroom_rating();

-- Trigger for deleted reviews
CREATE OR REPLACE TRIGGER trg_update_restroom_rating_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restroom_rating();

-- Insert sample users
INSERT INTO users (username, email, password_hash) VALUES
('admin', 'admin@flushfinder.com', 'hashed_password_admin'),
('testuser1', 'user1@example.com', 'hashed_password_1'),
('testuser2', 'user2@example.com', 'hashed_password_2')
ON CONFLICT (username) DO NOTHING;

-- Insert sample restrooms
INSERT INTO restrooms (name, description, latitude, longitude, address, city, state, zip_code, country, accessibility_features) VALUES
('Public Library Restroom', 'Clean and accessible public library restroom.', 40.7530, -73.9820, '476 5th Ave', 'New York', 'NY', '10018', 'USA', '{"wheelchair_accessible": true, "gender_neutral": false}'),
('Central Park Cafe Bathroom', 'Small cafe bathroom in Central Park.', 40.7829, -73.9654, 'Central Park', 'New York', 'NY', '10024', 'USA', '{"wheelchair_accessible": false, "gender_neutral": true}'),
('Times Square Starbucks', 'Starbucks with multiple restrooms, often busy.', 40.7580, -73.9855, '1500 Broadway', 'New York', 'NY', '10036', 'USA', '{"wheelchair_accessible": true, "gender_neutral": false}')
ON CONFLICT (name) DO NOTHING;

-- Insert sample reviews (assuming users and restrooms exist)
DO $$
DECLARE
    user1_id UUID;
    user2_id UUID;
    restroom1_id UUID;
    restroom2_id UUID;
    restroom3_id UUID;
BEGIN
    SELECT id INTO user1_id FROM users WHERE username = 'testuser1';
    SELECT id INTO user2_id FROM users WHERE username = 'testuser2';
    SELECT id INTO restroom1_id FROM restrooms WHERE name = 'Public Library Restroom';
    SELECT id INTO restroom2_id FROM restrooms WHERE name = 'Central Park Cafe Bathroom';
    SELECT id INTO restroom3_id FROM restrooms WHERE name = 'Times Square Starbucks';

    IF user1_id IS NOT NULL AND restroom1_id IS NOT NULL THEN
        INSERT INTO reviews (user_id, restroom_id, rating, comment) VALUES
        (user1_id, restroom1_id, 5, 'Very clean and spacious!'),
        (user1_id, restroom3_id, 4, 'A bit busy but always available.')
        ON CONFLICT DO NOTHING;
    END IF;

    IF user2_id IS NOT NULL AND restroom1_id IS NOT NULL THEN
        INSERT INTO reviews (user_id, restroom_id, rating, comment) VALUES
        (user2_id, restroom1_id, 4, 'Good, but sometimes a line.'),
        (user2_id, restroom2_id, 3, 'Small, but gets the job done.')
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Insert sample favorites
DO $$
DECLARE
    user1_id UUID;
    restroom1_id UUID;
BEGIN
    SELECT id INTO user1_id FROM users WHERE username = 'testuser1';
    SELECT id INTO restroom1_id FROM restrooms WHERE name = 'Public Library Restroom';

    IF user1_id IS NOT NULL AND restroom1_id IS NOT NULL THEN
        INSERT INTO favorites (user_id, restroom_id) VALUES
        (user1_id, restroom1_id)
        ON CONFLICT (user_id, restroom_id) DO NOTHING;
    END IF;
END $$;
