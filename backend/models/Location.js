const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  images: [{
    type: String, // Path to image file
  }],
  deviceId: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Create geospatial index for efficient location queries
locationSchema.index({ latitude: 1, longitude: 1 });

module.exports = mongoose.model('Location', locationSchema);

