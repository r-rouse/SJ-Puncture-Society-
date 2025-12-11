# San Jose Puncture Society

A React Native Expo app for anonymously tagging flat tire locations in San Jose, California. Users can mark locations on a map and upload images of where they got a flat tire.

## Project Structure

```
sj_puncture_society/
├── frontend/          # React Native Expo app
├── backend/           # Node.js/Express API server
└── README.md          # This file
```

## Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Make sure MongoDB is running (or update `MONGODB_URI` in `.env`)

5. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Update the API URL in `frontend/services/api.js`:
   - Replace `localhost` with your computer's local IP address
   - Example: `http://192.168.1.100:3000/api`
   - To find your IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)

4. Start the Expo development server:
```bash
npm start
```

5. Run on your device:
   - Install Expo Go app on your phone
   - Scan the QR code from the terminal
   - Or press `i` for iOS simulator, `a` for Android emulator

## Features

- **Interactive Map**: View and interact with a map centered on San Jose, CA
- **Location Tagging**: Tap on the map to select and tag flat tire locations
- **Image Upload**: Take photos or select from library when tagging locations
- **View All Locations**: See all previously tagged locations as markers on the map
- **Current Location**: Button to quickly center the map on your current location

## Tech Stack

### Frontend
- React Native
- Expo
- React Native Maps
- Expo Location
- Expo Image Picker
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- Multer (for file uploads)
- CORS

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/locations` - Get all flat tire locations
- `GET /api/locations/:id` - Get a specific location
- `POST /api/locations` - Create a new location (with images)
- `DELETE /api/locations/:id` - Delete a location

## Development Notes

- The backend stores images in the `backend/uploads/` directory
- Make sure MongoDB is running before starting the backend
- For mobile testing, ensure your phone and computer are on the same network
- Update the API URL in `frontend/services/api.js` to match your backend URL

## License

ISC

