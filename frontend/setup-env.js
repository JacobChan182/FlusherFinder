// Simple script to help set up the .env file
const fs = require('fs');
const path = require('path');

const envContent = `# Google Maps API Key
# Get your API key from: https://console.cloud.google.com/
# Enable: Maps JavaScript API, Geocoding API, Places API
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file');
    console.log('📝 Please edit .env and add your Google Maps API key');
    console.log('🔗 Get your API key from: https://console.cloud.google.com/');
} else {
    console.log('⚠️  .env file already exists');
}
