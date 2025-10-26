# Google Maps Setup Instructions

## 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Places API (optional, for enhanced location features)

## 2. Create API Key

1. Go to "Credentials" in the Google Cloud Console
2. Click "Create Credentials" → "API Key"
3. Copy your API key

## 3. Set Up Environment Variable

Create a `.env` file in the frontend directory with:

```
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

## 4. Security (Important!)

For production, restrict your API key:
1. Go to "Credentials" in Google Cloud Console
2. Click on your API key
3. Under "Application restrictions", select "HTTP referrers"
4. Add your domain (e.g., `yourdomain.com/*`)
5. Under "API restrictions", select "Restrict key" and choose only the APIs you need

## 5. Test the Integration

The map will show:
- Default location: New York City
- Pre-configured locations: New York, London, Paris, Tokyo, Sydney, Toronto, Vancouver
- Current location button (requires user permission)
- Interactive Google Maps with markers

## Features Included

- ✅ Interactive Google Maps integration
- ✅ Location search functionality
- ✅ Current location detection
- ✅ Map centering based on user input
- ✅ Loading and error states
- ✅ Responsive design
- ✅ Custom map styling
