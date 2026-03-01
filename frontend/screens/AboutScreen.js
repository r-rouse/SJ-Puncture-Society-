import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.content}>
        <Text style={styles.title}>About</Text>
        <Text style={styles.subtitle}>San Jose Puncture Society</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mission</Text>
          <Text style={styles.sectionText}>
            The San Jose Puncture Society is a community-driven app that helps cyclists 
            identify and avoid flat tire hotspots in San Jose, California. By anonymously 
            tagging locations where flat tires occur, we create a shared resource to help 
            everyone ride safer.
          </Text>
          <Text style={[styles.sectionText, { marginTop: 12, fontWeight: '600' }]}>
            We are collecting this puncture data to present to the San Jose City Council 
            to advocate for a comprehensive bike lane sweeping policy that will help keep 
            our cycling infrastructure safe and clean for all riders.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <Text style={styles.sectionText}>
            1. Tag locations where you've experienced a flat tire{'\n'}
            2. View the heat map to see problem areas{'\n'}
            3. Help the cycling community stay informed
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Heat Map Legend</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(0, 255, 0, 0.6)' }]} />
            <Text style={styles.legendText}>1 flat - Isolated incident</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(154, 205, 50, 0.6)' }]} />
            <Text style={styles.legendText}>2 flats - Occasional problem</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 255, 0, 0.6)' }]} />
            <Text style={styles.legendText}>3 flats - Moderate risk</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 165, 0, 0.6)' }]} />
            <Text style={styles.legendText}>4 flats - High risk area</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 99, 71, 0.6)' }]} />
            <Text style={styles.legendText}>5 flats - Very high risk</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'rgba(255, 0, 0, 0.6)' }]} />
            <Text style={styles.legendText}>6+ flats - Critical hotspot</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Text style={styles.sectionText}>
            All location tags are anonymous. We only collect geographic coordinates.
            No personal information is stored or shared.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Version</Text>
          <Text style={styles.sectionText}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  legendText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
});

