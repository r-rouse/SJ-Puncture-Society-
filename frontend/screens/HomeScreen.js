import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Box, Text } from '@gluestack-ui/themed';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { submitLocation, fetchLocations } from '../services/api';
import { getDeviceId } from '../utils/deviceId';

const SAN_JOSE_REGION = {
  latitude: 37.3382,
  longitude: -121.8863,
  latitudeDelta: 0.15,
  longitudeDelta: 0.15,
};

const SAN_JOSE_BOUNDS = {
  minLat: 37.21,
  maxLat: 37.46,
  minLng: -122.07,
  maxLng: -121.71,
};

function isWithinSanJose(lat, lng) {
  return (
    lat >= SAN_JOSE_BOUNDS.minLat &&
    lat <= SAN_JOSE_BOUNDS.maxLat &&
    lng >= SAN_JOSE_BOUNDS.minLng &&
    lng <= SAN_JOSE_BOUNDS.maxLng
  );
}

export default function HomeScreen() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [locationCount, setLocationCount] = useState(0);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapData, setHeatmapData] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(SAN_JOSE_REGION);
  const [deviceId, setDeviceId] = useState(null);
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    (async () => {
      // Get device ID
      const id = await getDeviceId();
      setDeviceId(id);

      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required to use this app.');
        return;
      }

      // Load existing locations first
      await loadLocations();
      
      // Focus map on San Jose initially
      if (mapRef.current) {
        mapRef.current.animateToRegion(SAN_JOSE_REGION, 1000);
      }
      
      // Get current location (but don't move map automatically)
      getCurrentLocation();
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      setLoading(true);
      const currentLocation = await Location.getCurrentPositionAsync({});
      const userLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocation(userLocation);
      // Note: Map will stay focused on San Jose unless user clicks "My Location" button
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Could not get your current location.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate density for heat map visualization
  // Count how many locations are within a small radius (in degrees, roughly 100-200 meters)
  const calculateDensity = (point, allPoints, radius = 0.001) => {
    let count = 0;
    allPoints.forEach(p => {
      const latDiff = p.coordinate.latitude - point.coordinate.latitude;
      const lngDiff = p.coordinate.longitude - point.coordinate.longitude;
      const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
      if (distance < radius) {
        count++;
      }
    });
    return count;
  };

  // Calculate heat map data from markers
  const calculateHeatmapData = (markerPoints) => {
    if (markerPoints.length === 0) return [];
    
    // Calculate density for each point (how many other points are nearby)
    const densities = markerPoints.map(m => calculateDensity(m, markerPoints));
    const maxDensity = Math.max(...densities, 1);
    const minDensity = Math.min(...densities, 1);
    
    console.log('Heat map densities:', densities);
    console.log('Max density:', maxDensity, 'Min density:', minDensity);
    
    return markerPoints.map((marker, index) => {
      const density = densities[index];
      // Normalize density (0 to 1)
      const normalizedDensity = (density - minDensity) / (maxDensity - minDensity || 1);
      
      // Smaller radius - 50m to 150m based on density (increased for better visibility)
      const radius = 120 + normalizedDensity * 180;
      
      // Opacity increases with density, max 50% (0.5) - cap it to ensure transparency
      const opacity = Math.min(0.1 + normalizedDensity * 0.4, 0.5);
      
      // Color gradient based on density count:
      // Green (1 location) -> Yellow (2-3) -> Orange (4-5) -> Red (6+)
      let fillColor;
      if (density === 1) {
        // Single location - green
        fillColor = `rgba(0, 255, 0, ${opacity})`;
      } else if (density <= 2) {
        // 2 locations - yellow-green
        fillColor = `rgba(154, 205, 50, ${opacity})`;
      } else if (density <= 3) {
        // 3 locations - yellow
        fillColor = `rgba(255, 255, 0, ${opacity})`;
      } else if (density <= 4) {
        // 4 locations - orange
        fillColor = `rgba(255, 165, 0, ${opacity})`;
      } else if (density <= 5) {
        // 5 locations - red-orange
        fillColor = `rgba(255, 99, 71, ${opacity})`;
      } else {
        // 6+ locations - red (hotspot)
        fillColor = `rgba(255, 0, 0, ${opacity})`;
      }
      
      return {
        id: marker.id,
        coordinate: marker.coordinate,
        radius,
        fillColor,
        density, // Store for debugging
        markerData: marker, // Store original marker data for dates
      };
    });
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
      setLocationCount(locations.length);
      // Calculate heat map data
      setHeatmapData(calculateHeatmapData(formattedMarkers));
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    const { latitude, longitude } = coordinate;
    if (!isWithinSanJose(latitude, longitude)) {
      Alert.alert(
        'Outside San Jose',
        'That location is outside San Jose city limits. This project only tracks flat tire reports within San Jose—please choose a spot inside the city.',
        [{ text: 'OK' }]
      );
      return;
    }
    setLocation(coordinate);
  };

  const handleSubmit = async () => {
    if (!location) {
      Alert.alert('Error', 'Please select a location on the map.');
      return;
    }
    if (!isWithinSanJose(location.latitude, location.longitude)) {
      Alert.alert(
        'Outside San Jose',
        'That location is outside San Jose city limits. This project only tracks flat tire reports within San Jose—please choose a spot inside the city.',
        [{ text: 'OK' }]
      );
      return;
    }
    await submitLocationWithImages(location, []);
  };

  const submitLocationWithImages = async (coords, imageUris) => {
    if (!deviceId) {
      Alert.alert('Error', 'Device ID not available. Please try again.');
      return;
    }

    try {
      setSubmitting(true);
      await submitLocation(coords.latitude, coords.longitude, imageUris, deviceId);
      Alert.alert('Success', 'Location tagged successfully!');
      await loadLocations(); // This will update the count automatically
    } catch (error) {
      console.error('Error submitting location:', error);
      const errorMessage = error.message || 'Could not submit location. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const zoomIn = () => {
    if (mapRef.current && currentRegion) {
      const newRegion = {
        latitude: currentRegion.latitude,
        longitude: currentRegion.longitude,
        latitudeDelta: currentRegion.latitudeDelta * 0.5,
        longitudeDelta: currentRegion.longitudeDelta * 0.5,
      };
      mapRef.current.animateToRegion(newRegion, 300);
      setCurrentRegion(newRegion);
    }
  };

  const zoomOut = () => {
    if (mapRef.current && currentRegion) {
      const newRegion = {
        latitude: currentRegion.latitude,
        longitude: currentRegion.longitude,
        latitudeDelta: Math.min(currentRegion.latitudeDelta * 2, 0.5),
        longitudeDelta: Math.min(currentRegion.longitudeDelta * 2, 0.5),
      };
      mapRef.current.animateToRegion(newRegion, 300);
      setCurrentRegion(newRegion);
    }
  };

  return (
    <Box flex={1} bg="$white">
      <StatusBar style="auto" />

      <Box pt="$12" pb="$3" px="$5" bg="$trueGray100" borderBottomWidth={1} borderBottomColor="$trueGray200">
        <Box flexDirection="row" justifyContent="space-between" alignItems="center">
          <Text size="xl" fontWeight="$bold" color="$trueGray800" flex={1}>
            San Jose Puncture Society
          </Text>
          <Box alignItems="flex-end" ml="$4">
            <Text size="2xl" fontWeight="$bold" color="$green600">
              {locationCount}
            </Text>
            <Text size="xs" color="$trueGray600" mt="$0.5">
              punctures
            </Text>
          </Box>
        </Box>
        <Text size="sm" color="$trueGray600" mt="$1">
          Tag flat tire locations
        </Text>
      </Box>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={SAN_JOSE_REGION}
        onRegionChangeComplete={setCurrentRegion}
        onPress={handleMapPress}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {showHeatmap && heatmapData.length > 0 && heatmapData.map((heatPoint) => (
          <Circle
            key={`heat-${heatPoint.id}`}
            center={heatPoint.coordinate}
            radius={heatPoint.radius}
            fillColor={heatPoint.fillColor}
            strokeColor="rgba(255, 0, 0, 0.2)"
            strokeWidth={1}
          />
        ))}
        {/* Only show selected location marker when heat map is active, no other markers */}
        {showHeatmap && location && (
          <Marker
            coordinate={location}
            pinColor="red"
            title="Selected Location"
            description="Tap submit to tag this location"
          />
        )}
        {/* Show all markers when heat map is not active */}
        {!showHeatmap && (
          <>
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
          </>
        )}
      </MapView>

      {/* Heat Map Legend */}
      {showHeatmap && showLegend && (
        <TouchableOpacity
          style={styles.legend}
          onLongPress={() => {
            Alert.alert(
              'Hide Legend',
              'Would you like to hide the legend?',
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Hide',
                  onPress: () => setShowLegend(false),
                },
              ],
              { cancelable: true }
            );
          }}
          activeOpacity={1}
        >
          <Text style={styles.legendTitle}>Tag Density</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 255, 0, 0.6)' }]} />
            <Text style={styles.legendText}>1 flat</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(154, 205, 50, 0.6)' }]} />
            <Text style={styles.legendText}>2 flats</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 255, 0, 0.6)' }]} />
            <Text style={styles.legendText}>3 flats</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 165, 0, 0.6)' }]} />
            <Text style={styles.legendText}>4 flats</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 99, 71, 0.6)' }]} />
            <Text style={styles.legendText}>5 flats</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.6)' }]} />
            <Text style={styles.legendText}>6+ flats</Text>
          </View>
        </TouchableOpacity>
      )}
      
      {/* Show Legend Button (when hidden) */}
      {showHeatmap && !showLegend && (
        <TouchableOpacity
          style={styles.showLegendButton}
          onPress={() => setShowLegend(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.showLegendButtonText}>Show Legend</Text>
        </TouchableOpacity>
      )}

      {/* Zoom Controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity
          style={[styles.zoomButton, styles.zoomButtonTop]}
          onPress={zoomIn}
          activeOpacity={0.7}
        >
          <Text style={styles.zoomButtonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.zoomButton}
          onPress={zoomOut}
          activeOpacity={0.7}
        >
          <Text style={styles.zoomButtonText}>−</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.button, styles.refreshButton, loading && { opacity: 0.6 }]}
          onPress={async () => {
            try {
              setLoading(true);
              const currentLocation = await Location.getCurrentPositionAsync({});
              const userLocation = {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              };
              setLocation(userLocation);
              
              // Move map to user's location when button is pressed
              if (mapRef.current) {
                const region = {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                };
                mapRef.current.animateToRegion(region, 1000);
              }
            } catch (error) {
              console.error('Error getting location:', error);
              Alert.alert('Error', 'Could not get your current location.');
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator color="#6c757d" />
          ) : (
            <Text style={styles.buttonText}>My Location</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.heatmapButton, showHeatmap && styles.heatmapButtonActive]}
          onPress={() => setShowHeatmap(!showHeatmap)}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>
            {showHeatmap ? 'Markers' : 'Heat Map'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitButton, (submitting || !location) && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting || !location}
          activeOpacity={0.7}
        >
          {submitting ? (
            <ActivityIndicator color="#28a745" />
          ) : (
            <Text style={[styles.buttonText, { color: '#28a745', textShadowColor: 'rgba(255, 255, 255, 0.9)' }]}>Tag Location</Text>
          )}
        </TouchableOpacity>
      </View>
    </Box>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  counterContainer: {
    alignItems: 'flex-end',
    marginLeft: 15,
  },
  counterText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
  },
  counterLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    left: 15,
    top: 180,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minWidth: 140,
  },
  showLegendButton: {
    position: 'absolute',
    left: 15,
    top: 180,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  showLegendButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#212529',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  zoomControls: {
    position: 'absolute',
    right: 15,
    top: 120,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dee2e6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  zoomButton: {
    width: 44,
    height: 44,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomButtonTop: {
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  zoomButtonText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#212529',
    lineHeight: 28,
  },
  controls: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#212529',
  },
  refreshButton: {
    backgroundColor: 'transparent',
    borderColor: '#212529',
  },
  heatmapButton: {
    backgroundColor: 'transparent',
    borderColor: '#212529',
  },
  heatmapButtonActive: {
    backgroundColor: 'transparent',
    borderColor: '#ffc107',
    borderWidth: 2,
  },
  submitButton: {
    backgroundColor: 'transparent',
    borderColor: '#28a745',
  },
  buttonText: {
    color: '#212529',
    fontSize: 15,
    fontWeight: '600',
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

