import React from 'react';
import '../styling/Home.css';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="home-container">
            <div className="hero-section">
                <h1>Welcome to FlushFinder</h1>
                <p className="hero-subtitle">
                    Find clean, accessible restrooms near you. Join our community of people 
                    who understand the importance of feeling safe and prepared when you're out and about.
                </p>
                <div className="hero-buttons">
                    <Link to="/main" className="btn-primary">Find Restrooms</Link>
                    <Link to="/about" className="btn-secondary">Learn More</Link>
                </div>
            </div>
            
            <div className="features-section">
                <h2>Why Choose FlushFinder?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">📍</div>
                        <h3>Find Nearby</h3>
                        <p>Discover clean restrooms in your area with consistently updated information</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">⭐</div>
                        <h3>Community Reviews</h3>
                        <p>Read honest reviews from people who understand your experiences</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">ℹ️</div>
                        <h3>Accessibility Info</h3>
                        <p>Know what to expect with detailed information about accessibility features</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
