const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB (fail fast so we don't serve requests with a stuck connection)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sj_puncture_society', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err.message || err);
});

// Routes
app.use('/api/locations', require('./routes/locations'));

// Root - so visiting the backend URL doesn't show "Cannot GET /"
app.get('/', (req, res) => {
  res.json({
    name: 'San Jose Puncture Society API',
    status: 'ok',
    endpoints: {
      health: '/api/health',
      locations: '/api/locations',
    },
  });
});

// Health check (includes DB status so you can confirm DB is accessible)
app.get('/api/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = dbState === 1 ? 'connected' : 'disconnected';
  const databaseConfigured = !!process.env.MONGODB_URI;
  res.json({
    status: dbState === 1 ? 'ok' : 'degraded',
    message: 'San Jose Puncture Society API is running',
    database: dbStatus,
    databaseConfigured,
  });
});

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

