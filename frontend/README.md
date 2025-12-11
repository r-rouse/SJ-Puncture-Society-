# San Jose Puncture Society - Frontend

React Native Expo app for tagging flat tire locations in San Jose, California.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the API URL in `services/api.js`:
   - For development, replace `localhost` with your computer's local IP address
   - For example: `http://192.168.1.100:3000/api`

3. Start the Expo development server:
```bash
npm start
```

4. Run on your device:
   - Scan the QR code with Expo Go app (iOS/Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

## Features

- **Map View**: Interactive map centered on San Jose, California
- **Location Tagging**: Tap on the map to select a location
- **Image Upload**: Take photos or choose from library when tagging
- **View Markers**: See all previously tagged flat tire locations
- **Current Location**: Button to center map on your current location

## Permissions

The app requires:
- Location permissions (to get current location and tag locations)
- Camera permissions (to take photos)
- Media library permissions (to select photos)

## Configuration

Update `services/api.js` with your backend URL before running the app.

