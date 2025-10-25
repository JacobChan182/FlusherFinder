import React, { useEffect, useRef, useState } from 'react';
import '../styling/InteractiveMap.css';

const InteractiveMap = ({ center }) => {
    const mapRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(false);

    useEffect(() => {
        const loadGoogleMaps = () => {
            // Check if Google Maps is already loaded
            if (window.google && window.google.maps) {
                initializeMap();
                return;
            }

            // Check if API key is properly configured
            const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
            if (!apiKey || apiKey === 'your_google_maps_api_key_here' || apiKey === 'demo') {
                setMapError(true);
                return;
            }

            // Load Google Maps script
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            
            script.onload = () => {
                if (window.google && window.google.maps) {
                    setMapLoaded(true);
                    initializeMap();
                } else {
                    setMapError(true);
                }
            };
            
            script.onerror = () => {
                setMapError(true);
            };
            
            document.head.appendChild(script);
        };

        const initializeMap = () => {
            if (mapRef.current && window.google && window.google.maps) {
                try {
                    const map = new window.google.maps.Map(mapRef.current, {
                        center: center,
                        zoom: 15,
                        mapTypeId: 'roadmap',
                        styles: [
                            {
                                featureType: 'poi',
                                elementType: 'labels',
                                stylers: [{ visibility: 'off' }]
                            }
                        ]
                    });

                    // Add a marker for the center location
                    new window.google.maps.Marker({
                        position: center,
                        map: map,
                        title: 'Your Location'
                    });
                } catch (error) {
                    console.error('Error initializing map:', error);
                    setMapError(true);
                }
            } else {
                console.error('Google Maps not properly loaded');
                setMapError(true);
            }
        };

        loadGoogleMaps();
    }, [center]);

    if (mapError) {
        return (
            <div className="interactive-map">
                <div className="map-error">
                    <h3>🗺️ Map Preview</h3>
                    <p>Location: {center.lat.toFixed(4)}, {center.lng.toFixed(4)}</p>
                    <p>To enable full Google Maps functionality, please add your Google Maps API key to the .env file.</p>
                    <div className="map-placeholder-content">
                        <div className="location-info">
                            <h4>📍 Your Location</h4>
                            <p>Latitude: {center.lat.toFixed(6)}</p>
                            <p>Longitude: {center.lng.toFixed(6)}</p>
                        </div>
                        <div className="setup-instructions">
                            <h4>🔧 Setup Instructions:</h4>
                            <ol>
                                <li>Get a Google Maps API key from Google Cloud Console</li>
                                <li>Create a .env file in the frontend directory</li>
                                <li>Add: REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here</li>
                                <li>Restart the development server</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!mapLoaded) {
        return (
            <div className="interactive-map">
                <div className="map-loading">
                    <p>Loading map...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="interactive-map">
            <div ref={mapRef} className="google-map" />
        </div>
    );
};

export default InteractiveMap;