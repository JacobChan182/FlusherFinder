import React, { useState, useEffect } from 'react';
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
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: ''
  });
  const [geocodingLoading, setGeocodingLoading] = useState(false);
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
      console.log('Fetching nearby washrooms for lat:', lat, 'lng:', lng);
      const response = await fetch(
        `${API_BASE_URL}/search/nearby?lat=${lat}&lng=${lng}&radius=5000&limit=100`
      );
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched washrooms:', data);
        setWashrooms(data || []);
      } else {
        console.error('Failed to fetch washrooms:', response.status, response.statusText);
      }
    } catch (err) {
      console.error('Error fetching washrooms:', err);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      setGeocodingLoading(true);
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apikey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const result = data.results[0];
        let address = result.formatted_address;
        let city = '';
        
        // Try to extract city from address components
        const cityComponent = result.address_components.find(
          component => component.types.includes('locality')
        );
        if (cityComponent) {
          city = cityComponent.long_name;
        } else {
          // Fallback: try to extract from formatted address
          const parts = address.split(',');
          if (parts.length > 2) {
            city = parts[parts.length - 3].trim();
          }
        }
        
        return { address, city };
      }
      return { address: '', city: '' };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { address: '', city: '' };
    } finally {
      setGeocodingLoading(false);
    }
  };

  const handleMapClick = async (event) => {
    if (event.detail.latLng) {
      const lat = event.detail.latLng.lat;
      const lng = event.detail.latLng.lng;
      setSelectedLocation({ lat, lng });
      
      // Reverse geocode to get address
      const { address, city } = await reverseGeocode(lat, lng);
      
      // Pre-fill form with address
      setWashroomForm({
        name: '',
        address: address,
        city: city,
        is_public: true,
        price: '',
        amenities: []
      });
      
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
    
    if (!selectedLocation) {
      alert('Please click on the map to select a location first');
      return;
    }

    try {
      const requestBody = {
        ...washroomForm,
        lat: selectedLocation.lat,
        lng: selectedLocation.lng
      };
      console.log('Sending request:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/washrooms/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        await response.json(); // Washroom created, will refresh list
        setShowModal(false);
        setWashroomForm({
          name: '',
          address: '',
          city: '',
          is_public: true,
          price: '',
          amenities: []
        });
        
        // Refresh washrooms list to show the new one
        if (userLocation) {
          fetchNearbyWashrooms(userLocation.lat, userLocation.lng);
        }
        
        alert('Washroom location added successfully!');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        alert(`Failed to create washroom: ${errorData.detail || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error creating washroom:', err);
      alert('Failed to create washroom. Please try again.');
    }
  };

  const handleCreateReview = async (e) => {
  e.preventDefault();
  const token = getAuthToken();
  
  if (!token) {
    alert('Please login to leave a review');
    return;
  }
  
  if (!selectedWashroom) {
    alert('Please select a washroom first');
    return;
  }

  try {
    console.log('Creating review for washroom:', selectedWashroom.id);
    
    const response = await fetch(`${API_BASE_URL}/reviews/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        washroom_id: selectedWashroom.id,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      })
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const newReview = await response.json();
      console.log('Review created:', newReview);
      setShowReviewModal(false);
      setReviewForm({ rating: 5, comment: '' });
      alert('Review submitted successfully!');
      
      // Optionally refresh washrooms to get updated ratings
      if (userLocation) {
        fetchNearbyWashrooms(userLocation.lat, userLocation.lng);
      }
    } else {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      alert(`Failed to submit review: ${errorData.detail || 'Unknown error'}`);
    }
  } catch (err) {
    console.error('Error creating review:', err);
    alert('Failed to submit review. Please try again.');
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
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="btn-review"
                >
                  Leave a Review
                </button>
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
                  <label>Address {geocodingLoading && <span className="loading-text">(Loading...)</span>}</label>
                  <input
                    type="text"
                    value={washroomForm.address}
                    readOnly
                    className="readonly-input"
                    placeholder="Auto-filled from map location"
                  />
                </div>
                
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={washroomForm.city}
                    readOnly
                    className="readonly-input"
                    placeholder="Auto-filled from map location"
                  />
                </div>
                
                {selectedLocation && (
                  <div className="form-group">
                    <label>Coordinates</label>
                    <div className="coordinates-display">
                      <span>📍 {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}</span>
                    </div>
                  </div>
                )}
                
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

        {showReviewModal && (
          <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Leave a Review</h2>
              <p><strong>{selectedWashroom?.name}</strong></p>
              
              <form onSubmit={handleCreateReview}>
                <div className="form-group">
                  <label>Rating *</label>
                  <select
                  required
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: parseFloat(e.target.value) })}
                  className="rating-select"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ Excellent (5)</option>
                    <option value={4}>⭐⭐⭐⭐ Very Good (4)</option>
                    <option value={3}>⭐⭐⭐ Good (3)</option>
                    <option value={2}>⭐⭐ Fair (2)</option>
                    <option value={1}>⭐ Poor (1)</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Comment</label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    placeholder="Share your experience..."
                    rows={4}
                    className="review-comment"
                  />
                </div>
        
                <div className="modal-buttons">
                  <button type="submit" className="btn-primary">Submit Review</button>
                  <button type="button" onClick={() => setShowReviewModal(false)} className="btn-secondary">Cancel</button>
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