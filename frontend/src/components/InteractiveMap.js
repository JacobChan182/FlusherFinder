import React, { useState, useEffect, useCallback } from 'react';
import { APIProvider, Map, Marker, useMap } from '@vis.gl/react-google-maps';

const InteractiveMap = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyRestrooms, setNearbyRestrooms] = useState([]);
  const [error, setError] = useState(null);
  const [searching, setSearching] = useState(false);

  const apikey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (err) => {
          setError(err.message);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  const API_KEY = apikey; // Replace with your actual API key

  const findNearbyRestrooms = useCallback((map, center) => {
    if (!map || !center) return;

    setSearching(true);
    setNearbyRestrooms([]);

    const placesService = new window.google.maps.places.PlacesService(map);

    // --- Start of Corrected Code ---
    const request = {
      location: center,
      radius: 2000, // CORRECTED: radius is a number, not a string
      keyword: 'restroom' // Using keyword is more flexible than 'type'
    };
    // --- End of Corrected Code ---

    placesService.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setNearbyRestrooms(results);
      } else if (status) {
        // You can add more detailed error handling here
        console.error('Places API search failed with status:', status);
      }
      setSearching(false);
    });
  }, []);


  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userLocation) {
    return <div>Loading map and getting your location... (Please allow location access)</div>;
  }

  return (
    <APIProvider apiKey={API_KEY} libraries={['places']}>
      <div style={{ height: "100vh", width: "100%", position: 'relative' }}>
        <Map
          defaultCenter={userLocation}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <Marker position={userLocation} />
          {nearbyRestrooms.map((place) => (
            <Marker
              key={place.place_id}
              position={place.geometry.location}
              title={place.name}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              }}
            />
          ))}
        </Map>
        <SearchButton onSearch={findNearbyRestrooms} disabled={searching} />
      </div>
    </APIProvider>
  );
};

const SearchButton = ({ onSearch, disabled }) => {
  const map = useMap();

  const handleClick = () => {
    if (!map) return;
    const center = map.getCenter();
    onSearch(map, center.toJSON());
  };

  useEffect(() => {
    if (map) {
      const center = map.getCenter();
      onSearch(map, center.toJSON());
    }
  }, [map, onSearch]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 1,
        padding: '10px 15px',
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      {disabled ? 'Searching...' : 'Find Nearby Restrooms'}
    </button>
  );
};

export default InteractiveMap;