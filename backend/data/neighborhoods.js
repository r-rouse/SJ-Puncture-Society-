/**
 * San Jose neighborhood bounding boxes (approx).
 * Each: { name, minLat, maxLat, minLng, maxLng }. Point (lat,lng) is in neighborhood if
 * minLat <= lat <= maxLat && minLng <= lng <= maxLng.
 * Checked in order; first match wins. Locations outside all boxes go to "Other".
 */
const NEIGHBORHOODS = [
  { name: 'Downtown', minLat: 37.32, maxLat: 37.35, minLng: -121.90, maxLng: -121.88 },
  { name: 'Japantown', minLat: 37.35, maxLat: 37.37, minLng: -121.90, maxLng: -121.88 },
  { name: 'Rose Garden', minLat: 37.33, maxLat: 37.35, minLng: -121.89, maxLng: -121.87 },
  { name: 'Willow Glen', minLat: 37.29, maxLat: 37.32, minLng: -121.92, maxLng: -121.88 },
  { name: 'Midtown', minLat: 37.31, maxLat: 37.34, minLng: -121.91, maxLng: -121.87 },
  { name: 'Berryessa', minLat: 37.37, maxLat: 37.42, minLng: -121.89, maxLng: -121.82 },
  { name: 'North San Jose', minLat: 37.39, maxLat: 37.45, minLng: -122.02, maxLng: -121.88 },
  { name: 'Alum Rock', minLat: 37.35, maxLat: 37.40, minLng: -121.83, maxLng: -121.78 },
  { name: 'East San Jose', minLat: 37.31, maxLat: 37.38, minLng: -121.83, maxLng: -121.75 },
  { name: 'West San Jose', minLat: 37.27, maxLat: 37.35, minLng: -122.06, maxLng: -121.92 },
  { name: 'South San Jose', minLat: 37.22, maxLat: 37.30, minLng: -121.85, maxLng: -121.75 },
  { name: 'Evergreen', minLat: 37.28, maxLat: 37.35, minLng: -121.78, maxLng: -121.72 },
  { name: 'Almaden Valley', minLat: 37.22, maxLat: 37.28, minLng: -121.88, maxLng: -121.82 },
  { name: 'Santa Teresa', minLat: 37.23, maxLat: 37.28, minLng: -121.82, maxLng: -121.76 },
];

function getNeighborhoodForPoint(lat, lng) {
  for (const n of NEIGHBORHOODS) {
    if (lat >= n.minLat && lat <= n.maxLat && lng >= n.minLng && lng <= n.maxLng) {
      return n.name;
    }
  }
  return 'Other';
}

module.exports = { NEIGHBORHOODS, getNeighborhoodForPoint };
