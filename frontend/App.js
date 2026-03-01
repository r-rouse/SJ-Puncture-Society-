import React from 'react';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';
import DataScreen from './screens/DataScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <SafeAreaProvider>
        <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: '#28a745',
            tabBarInactiveTintColor: '#666',
            tabBarStyle: {
              backgroundColor: '#fff',
              borderTopWidth: 1,
              borderTopColor: '#e0e0e0',
              height: 60,
              paddingBottom: 8,
              paddingTop: 8,
            },
            tabBarLabelStyle: {
              fontSize: 12,
              fontWeight: '600',
            },
          }}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="map" size={size} color={color} />
              ),
              tabBarLabel: 'Map',
            }}
          />
          <Tab.Screen
            name="About"
            component={AboutScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="information-circle" size={size} color={color} />
              ),
              tabBarLabel: 'About',
            }}
          />
          <Tab.Screen
            name="Data"
            component={DataScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="bar-chart" size={size} color={color} />
              ),
              tabBarLabel: 'Data',
            }}
          />
        </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
