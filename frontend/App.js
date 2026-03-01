import React from 'react';
import { Text } from 'react-native';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '@gluestack-ui/config';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/AboutScreen';

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
                <Text style={{ fontSize: size, color }}>🗺️</Text>
              ),
              tabBarLabel: 'Map',
            }}
          />
          <Tab.Screen
            name="About"
            component={AboutScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>⚙️</Text>
              ),
              tabBarLabel: 'About',
            }}
          />
        </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}
