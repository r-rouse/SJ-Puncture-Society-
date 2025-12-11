import axios from 'axios';

// Update this to match your backend URL
// For development, use your local IP address (e.g., http://192.168.1.100:3000)
// For production, use your deployed backend URL
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-backend-url.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
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

export const submitLocation = async (latitude, longitude, imageUris = []) => {
  try {
    const formData = new FormData();
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());

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

    const response = await api.post('/locations', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error submitting location:', error);
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

