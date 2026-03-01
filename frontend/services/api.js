import axios from 'axios';

// iOS Simulator cannot reach localhost (it refers to the simulator, not your Mac).
// Use your Railway (or other) backend URL. If you see timeouts, confirm the app is deployed and copy the URL from your dashboard.
const API_BASE_URL = 'https://sj-puncture-society-production.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 25000,
});

export const fetchLocations = async () => {
  try {
    const response = await api.get('/locations');
    return response.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

export const fetchNeighborhoods = async () => {
  try {
    const response = await api.get('/locations/neighborhoods');
    return response.data;
  } catch (error) {
    console.error('Error fetching neighborhoods:', error);
    throw error;
  }
};

export const submitLocation = async (latitude, longitude, imageUris = [], deviceId) => {
  try {
    const formData = new FormData();
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('deviceId', deviceId);

    // Append images to form data
    imageUris.forEach((uri, index) => {
      const filename = uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      
      formData.append('images', {
        uri,
        name: filename,
        type,
      });
    });

    const response = await api.post('/locations', formData);

    return response.data;
  } catch (error) {
    console.error('Error submitting location:', error);
    // Extract error message from response
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || error.response.data.error || 'Failed to submit location');
    }
    throw error;
  }
};

export const deleteLocation = async (id) => {
  try {
    const response = await api.delete(`/locations/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};

