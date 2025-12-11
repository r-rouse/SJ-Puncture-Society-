# San Jose Puncture Society - Backend

Backend API for the San Jose Puncture Society app.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Make sure MongoDB is running locally or update `MONGODB_URI` in `.env` to point to your MongoDB instance.

4. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/locations` - Get all flat tire locations
- `GET /api/locations/:id` - Get a specific location
- `POST /api/locations` - Create a new location (with images)
- `DELETE /api/locations/:id` - Delete a location

## Environment Variables

- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

