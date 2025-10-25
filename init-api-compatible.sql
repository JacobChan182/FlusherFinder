-- Create users table matching API model
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email VARCHAR(320) UNIQUE NOT NULL,
    display_name VARCHAR(120),
    hashed_password VARCHAR(256) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create restrooms table (simplified for now)
CREATE TABLE restrooms (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    accessibility_features JSONB,
    average_rating NUMERIC(2, 1),
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reviews table
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restroom_id VARCHAR(36) NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create favorites table
CREATE TABLE favorites (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    restroom_id VARCHAR(36) NOT NULL REFERENCES restrooms(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, restroom_id)
);

-- Insert sample data
INSERT INTO users (email, display_name, hashed_password) VALUES
('admin@flushfinder.com', 'Admin', 'hashed_password_admin'),
('test@example.com', 'Test User', 'hashed_password_test');

INSERT INTO restrooms (name, description, latitude, longitude, address, city, state, country) VALUES
('Public Library Restroom', 'Clean and accessible public library restroom.', 40.7530, -73.9820, '476 5th Ave', 'New York', 'NY', 'USA'),
('Central Park Cafe Bathroom', 'Small cafe bathroom in Central Park.', 40.7829, -73.9654, 'Central Park', 'New York', 'NY', 'USA');
