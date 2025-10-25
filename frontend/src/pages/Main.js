import React from 'react';
import '../styling/Main.css';

const Main = () => {
    return (
        <div className="main-container">
            <div className="main-header">
                <h1>Find Restrooms Near You</h1>
                <p>Discover clean, accessible restrooms in your area</p>
            </div>
            
            <div className="search-section">
                <div className="search-bar">
                    <input 
                        type="text" 
                        placeholder="Enter your location or use current location"
                        className="location-input"
                    />
                    <button className="search-btn">Search</button>
                </div>
            </div>
            
            <div className="map-section">
                <div className="map-placeholder">
                    <p>🗺️ Interactive Map Coming Soon</p>
                    <p>Find restrooms on the map with real-time availability</p>
                </div>
            </div>
            
            <div className="results-section">
                <h2>Nearby Restrooms</h2>
                <div className="restroom-list">
                    <div className="restroom-card">
                        <h3>📍 Coffee Shop Downtown</h3>
                        <p>123 Main Street</p>
                        <div className="rating">⭐⭐⭐⭐⭐ (4.8/5)</div>
                        <div className="features">
                            <span className="feature-tag">Clean</span>
                            <span className="feature-tag">Accessible</span>
                            <span className="feature-tag">Single Occupancy</span>
                        </div>
                    </div>
                    
                    <div className="restroom-card">
                        <h3>📍 Shopping Mall</h3>
                        <p>456 Commerce Ave</p>
                        <div className="rating">⭐⭐⭐⭐ (4.2/5)</div>
                        <div className="features">
                            <span className="feature-tag">Multiple Stalls</span>
                            <span className="feature-tag">Changing Table</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
