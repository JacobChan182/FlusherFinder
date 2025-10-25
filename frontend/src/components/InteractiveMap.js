import React, { useState, useEffect } from 'react';
import { APIProvider, Map, Marker } from '@vis.gl/react-google-maps';

function InteractiveMap() {
  const [userLocation, setUserLocation] = useState(null);
  const [error, setError] = useState(null);
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

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userLocation) {
    return <div>Loading map... (Please allow location access)</div>;
  }

  return (
    <APIProvider apiKey={apikey}>
      <div style={{ height: "100vh", width: "100%" }}>
        <Map
          defaultCenter={userLocation}
          defaultZoom={15}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <Marker position={userLocation} />
        </Map>
      </div>
    </APIProvider>
  );
}

export default InteractiveMap;