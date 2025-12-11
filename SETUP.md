# Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (running locally or MongoDB Atlas account)
- Expo CLI (will be installed with npm install in frontend)

## Step-by-Step Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/sj_puncture_society
NODE_ENV=development
```

If using MongoDB Atlas, replace `MONGODB_URI` with your connection string.

Start MongoDB (if running locally):
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or run directly
mongod
```

Start the backend server:
```bash
npm run dev
```

The backend should now be running on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Important**: Update the API URL in `frontend/services/api.js`:
- Replace `localhost` with your computer's local IP address
- Find your IP:
  - macOS: `ipconfig getifaddr en0`
  - Windows: `ipconfig` (look for IPv4 Address)
  - Linux: `hostname -I`
- Example: `http://192.168.1.100:3000/api`

Create placeholder assets (or add your own images):
- `frontend/assets/icon.png` (1024x1024px)
- `frontend/assets/splash.png` (1242x2436px)
- `frontend/assets/adaptive-icon.png` (1024x1024px)
- `frontend/assets/favicon.png` (48x48px)

Start Expo:
```bash
npm start
```

### 3. Running on Device

1. Install **Expo Go** app on your phone (iOS App Store or Google Play)
2. Make sure your phone and computer are on the same WiFi network
3. Scan the QR code from the terminal with:
   - iOS: Camera app
   - Android: Expo Go app

### 4. Testing

1. Open the app on your device
2. Grant location and camera permissions when prompted
3. Tap on the map to select a location
4. Tap "Tag Location" button
5. Choose to take a photo, select from library, or skip
6. The location should appear as a marker on the map

## Troubleshooting

### Backend won't start
- Make sure MongoDB is running
- Check that port 3000 is not in use
- Verify `.env` file exists and has correct values

### Frontend can't connect to backend
- Verify backend is running on the correct port
- Update API URL in `frontend/services/api.js` with your local IP (not localhost)
- Ensure phone and computer are on the same network
- Check firewall settings

### Images not uploading
- Verify camera/media library permissions are granted
- Check backend `uploads/` directory exists and is writable
- Check file size (limit is 5MB per image)

### Map not showing
- Verify location permissions are granted
- Check internet connection (map tiles require internet)

