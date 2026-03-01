import * as Application from 'expo-application';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = '@sj_puncture_device_id';

// Get or create a unique device ID
export const getDeviceId = async () => {
  try {
    // Try to get stored device ID
    let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (deviceId) {
      return deviceId;
    }

    // If no stored ID, try to get from device
    if (Platform.OS === 'android') {
      deviceId = Application.androidId;
    } else if (Platform.OS === 'ios') {
      // iOS doesn't provide a stable device ID, so we'll generate one
      deviceId = null;
    }
    
    if (!deviceId) {
      // Fallback: generate a unique ID and store it
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Store the device ID for future use
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    
    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    // Fallback: generate a unique ID
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
};

