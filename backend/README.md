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

### Railway + MongoDB Atlas

If you see `querySrv ENOTFOUND _mongodb._tcp....` on Railway, Atlas’s SRV URL may not resolve in that environment. Use the **standard** connection string instead of `mongodb+srv://`:

1. In [MongoDB Atlas](https://cloud.mongodb.com): your project → **Connect** → **Drivers**.
2. Copy the URI but change the scheme: replace `mongodb+srv://` with `mongodb://` and add `:27017` after the host (e.g. `mongodb://sjps.7lrp7pr.mongodb.net:27017/yourdb?retryWrites=true&w=majority`).
3. Set that as `MONGODB_URI` in Railway (Variables / Environment).
4. Ensure Atlas **Network Access** allows Railway (or `0.0.0.0/0` for testing).
5. Redeploy the service on Railway.

