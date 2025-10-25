import React, { useState } from 'react';
import '../styling/Main.css';
import InteractiveMap from '../components/InteractiveMap';

const Main = () => {
    const [location, setLocation] = useState('');
    const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC

    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const handleSearch = () => {
        if (location.trim()) {
            // In a real app, you'd use Google Geocoding API here
            // For now, we'll simulate with some common locations
            const locationMap = {
                'new york': { lat: 40.7128, lng: -74.0060 },
                'london': { lat: 51.5074, lng: -0.1278 },
                'paris': { lat: 48.8566, lng: 2.3522 },
                'tokyo': { lat: 35.6762, lng: 139.6503 },
                'sydney': { lat: -33.8688, lng: 151.2093 },
                'toronto': { lat: 43.6532, lng: -79.3832 },
                'vancouver': { lat: 49.2827, lng: -123.1207 }
            };
            
            const normalizedLocation = location.toLowerCase();
            if (locationMap[normalizedLocation]) {
                setMapCenter(locationMap[normalizedLocation]);
            } else {
                // Default fallback
                setMapCenter({ lat: 40.7128, lng: -74.0060 });
            }
        }
    };

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setMapCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    setLocation('Current Location');
                },
                (error) => {
                    console.error('Error getting location:', error);
                    alert('Unable to get your current location. Please enter a location manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

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
                        value={location}
                        onChange={handleLocationChange}
                    />
                    <button className="search-btn" onClick={handleSearch}>Search</button>
                    <button className="current-location-btn" onClick={handleCurrentLocation}>📍</button>
                </div>
            </div>
            
            <div className="map-section">
                <InteractiveMap center={mapCenter} />
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
