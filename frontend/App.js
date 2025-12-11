import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { StatusBar } from 'expo-status-bar';
import { submitLocation, fetchLocations } from './services/api';

const SAN_JOSE_REGION = {
  latitude: 37.3382,
  longitude: -121.8863,
  latitudeDelta: 0.1,
  longitudeDelta: 0.1,
};

export default function App() {
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this app.');
        return;
      }

      // Request camera/media library permissions
      const { status: imageStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (imageStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Media library permission is required to upload images.');
      }

      // Get current location
      getCurrentLocation();
      
      // Load existing locations
      loadLocations();
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location.');
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const locations = await fetchLocations();
      const formattedMarkers = locations.map(loc => ({
        id: loc._id,
        coordinate: {
          latitude: loc.latitude,
          longitude: loc.longitude,
        },
        images: loc.images,
        createdAt: loc.createdAt,
      }));
      setMarkers(formattedMarkers);
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setLocation(coordinate);
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets.map(asset => asset.uri);
      }
      return [];
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Could not pick image.');
      return [];
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        return [result.assets[0].uri];
      }
      return [];
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Could not take photo.');
      return [];
    }
  };

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert('Error', 'Please select a location on the map.');
      return;
    }

    Alert.alert(
      'Add Images',
      'Would you like to add images to this location?',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const images = await takePhoto();
            await submitLocationWithImages(location, images);
          },
        },
        {
          text: 'Choose from Library',
          onPress: async () => {
            const images = await pickImage();
            await submitLocationWithImages(location, images);
          },
        },
        {
          text: 'Skip',
          onPress: () => submitLocationWithImages(location, []),
        },
      ]
    );
  };

  const submitLocationWithImages = async (coords, imageUris) => {
    try {
      setSubmitting(true);
      await submitLocation(coords.latitude, coords.longitude, imageUris);
      Alert.alert('Success', 'Location tagged successfully!');
      await loadLocations();
      // Add the new marker to the map
      setMarkers([...markers, {
        id: Date.now().toString(),
        coordinate: coords,
        images: imageUris,
        createdAt: new Date(),
      }]);
    } catch (error) {
      console.error('Error submitting location:', error);
      Alert.alert('Error', 'Could not submit location. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Text style={styles.title}>San Jose Puncture Society</Text>
        <Text style={styles.subtitle}>Tag flat tire locations</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={SAN_JOSE_REGION}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {location && (
          <Marker
            coordinate={location}
            pinColor="red"
            title="Selected Location"
            description="Tap submit to tag this location"
          />
        )}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            pinColor="blue"
            title="Flat Tire Location"
            description={`Tagged on ${new Date(marker.createdAt).toLocaleDateString()}`}
          />
        ))}
      </MapView>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.refreshButton]}
          onPress={getCurrentLocation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>📍 My Location</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleSubmit}
          disabled={submitting || !location}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>✅ Tag Location</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  map: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  refreshButton: {
    backgroundColor: '#6c757d',
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

