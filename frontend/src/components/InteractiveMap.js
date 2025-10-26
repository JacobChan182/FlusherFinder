import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { API_BASE_URL } from '../config';
import { getAuthToken } from '../utils/cookies';
import './InteractiveMap.css';

function InteractiveMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [washrooms, setWashrooms] = useState([]);
  const [selectedWashroom, setSelectedWashroom] = useState(null);
  const [washroomForm, setWashroomForm] = useState({
    name: '',
    address: '',
    city: '',
    is_public: true,
    price: '',
    amenities: []
  });
  const apikey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
          fetchNearbyWashrooms(loc.lat, loc.lng);
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchNearbyWashrooms = async (lat, lng) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/search/nearby?lat=${lat}&lng=${lng}&radius=5000&limit=100`
      );
      if (response.ok) {
        const data = await response.json();
        setWashrooms(data || []);
      }
    } catch (err) {
      console.error('Error fetching washrooms:', err);
    }
  };

  const handleMapClick = (event) => {
    if (event.detail.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      setSelectedLocation({ lat, lng });
      setShowModal(true);
    }
  };

  const handleCreateWashroom = async (e) => {
    e.preventDefault();
    const token = getAuthToken();
    
    if (!token) {
      alert('Please login to create a washroom location');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/washrooms/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...washroomForm,
          lat: selectedLocation.lat,
          lng: selectedLocation.lng
        })
      });

      if (response.ok) {
        const newWashroom = await response.json();
        setWashrooms([...washrooms, newWashroom]);
        setShowModal(false);
        setWashroomForm({
          name: '',
          address: '',
          city: '',
          is_public: true,
          price: '',
          amenities: []
        });
        alert('Washroom location added successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to create washroom: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating washroom:', err);
      alert('Failed to create washroom. Please try again.');
    }
  };

  if (error) {
    return <div className="map-error">Error: {error}</div>;
  }

  if (!userLocation) {
    return <div className="map-loading">Loading map... (Please allow location access)</div>;
  }

  return (
    <APIProvider apiKey={apikey}>
      <div style={{ position: 'relative', height: "100vh", width: "100%" }}>
        <div className="map-instructions">
          <p>Click anywhere on the map to add a washroom location</p>
        </div>
        
        <Map
          defaultCenter={userLocation}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
          onClick={handleMapClick}
        >
          <Marker position={userLocation} label="You" />
          
          {washrooms.map((washroom) => (
            <Marker
              key={washroom.id}
              position={{ lat: washroom.lat, lng: washroom.lng }}
              onClick={() => setSelectedWashroom(washroom)}
            />
          ))}
          
          {selectedWashroom && (
            <InfoWindow
              position={{ lat: selectedWashroom.lat, lng: selectedWashroom.lng }}
              onCloseClick={() => setSelectedWashroom(null)}
            >
              <div className="washroom-info">
                <h3>{selectedWashroom.name}</h3>
                <p>{selectedWashroom.address}</p>
                {selectedWashroom.avgRating && (
                  <p>⭐ {selectedWashroom.avgRating} ({selectedWashroom.ratingCount} reviews)</p>
                )}
                <p>{selectedWashroom.is_public ? 'Public' : 'Private'}</p>
              </div>
            </InfoWindow>
          )}
        </Map>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Add Washroom Location</h2>
              <form onSubmit={handleCreateWashroom}>
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    required
                    value={washroomForm.name}
                    onChange={(e) => setWashroomForm({ ...washroomForm, name: e.target.value })}
                    placeholder="e.g., Starbucks Restroom"
                  />
                </div>
                
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    value={washroomForm.address}
                    onChange={(e) => setWashroomForm({ ...washroomForm, address: e.target.value })}
                    placeholder="Street address"
                  />
                </div>
                
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={washroomForm.city}
                    onChange={(e) => setWashroomForm({ ...washroomForm, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                
                <div className="form-group">
                  <label>Price</label>
                  <input
                    type="text"
                    value={washroomForm.price}
                    onChange={(e) => setWashroomForm({ ...washroomForm, price: e.target.value })}
                    placeholder="Free, $5, etc."
                  />
                </div>
                
                <div className="form-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={washroomForm.is_public}
                      onChange={(e) => setWashroomForm({ ...washroomForm, is_public: e.target.checked })}
                    />
                    Public Washroom
                  </label>
                </div>
                
                <div className="modal-buttons">
                  <button type="submit" className="btn-primary">Save Location</button>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </APIProvider>
  );
}

export default InteractiveMap;