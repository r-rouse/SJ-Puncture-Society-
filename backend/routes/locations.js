const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const Location = require('../models/Location');

// Fail fast if DB is not connected (avoids buffering timeout 500s)
const requireDb = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      error: 'Database unavailable',
      message: 'Cannot connect to MongoDB. Check MONGODB_URI and that MongoDB is running.',
    });
  }
  next();
};

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'image-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// GET all locations
router.get('/', requireDb, async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const { getNeighborhoodForPoint } = require('../data/neighborhoods');

// GET neighborhood counts (must be before /:id)
router.get('/neighborhoods', requireDb, async (req, res) => {
  try {
    const locations = await Location.find({}, { latitude: 1, longitude: 1 });
    const counts = {};
    locations.forEach((loc) => {
      const name = getNeighborhoodForPoint(loc.latitude, loc.longitude);
      counts[name] = (counts[name] || 0) + 1;
    });
    const list = Object.entries(counts).map(([name, count]) => ({ name, count }));
    list.sort((a, b) => b.count - a.count);
    res.json(list);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET location by ID
router.get('/:id', requireDb, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to check daily limit
const checkDailyLimit = async (deviceId) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const count = await Location.countDocuments({
    deviceId: deviceId,
    createdAt: {
      $gte: today,
      $lt: tomorrow,
    },
  });

  return count;
};

// POST create new location with images
router.post('/', requireDb, upload.array('images', 5), async (req, res) => {
  try {
    const { latitude, longitude, deviceId } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    if (!deviceId) {
      return res.status(400).json({ error: 'Device ID is required' });
    }

    // Check daily limit (2 per device per day)
    const todayCount = await checkDailyLimit(deviceId);
    if (todayCount >= 2) {
      return res.status(429).json({ 
        error: 'Daily limit reached',
        message: 'You can only tag 2 flat tire locations per day. Please try again tomorrow.',
      });
    }

    const imagePaths = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const location = new Location({
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      images: imagePaths,
      deviceId: deviceId,
    });

    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE location by ID
router.delete('/:id', requireDb, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Delete associated images
    location.images.forEach(imagePath => {
      const fullPath = path.join(__dirname, '../', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

