import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [sharing, setSharing] = useState(false);
  const [showShareButton, setShowShareButton] = useState(false);
  const mapRef = useRef<MapView>(null);
  const userId = 'Test-user-001';

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      const current = await Location.getCurrentPositionAsync({});
      setLocation(current);
      console.log('📍 Got current location:', current.coords);

      if (sharing) {
        try {
          const userRef = doc(db, 'locations', userId);
          await setDoc(userRef, {
            lat: current.coords.latitude,
            lon: current.coords.longitude,
            lastUpdated: serverTimestamp(),
          });
          console.log('✅ Location saved to Firestore!');
        } catch (error) {
          console.error('❌ Error saving to Firestore:', error);
        }
      }
    };

    fetchLocation();
  }, [sharing]);

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={() => setShowShareButton(false)}
          >
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              pinColor={sharing ? 'red' : 'gray'}
              onPress={() => setShowShareButton(true)}
            />
          </MapView>

          {showShareButton && (
            <View style={styles.floatingBox}>
              <TouchableOpacity
                onPress={() => {
                  setSharing(!sharing);
                  setShowShareButton(false);
                }}
                style={styles.shareButton}
              >
                <Text style={styles.shareButtonText}>
                  {sharing ? 'Stop Sharing' : 'Start Sharing'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  floatingBox: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 80,
    left: Dimensions.get('window').width / 2 - 75,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    elevation: 4,
    zIndex: 999,
    width: 150,
  },
  shareButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    textAlign: 'center',
  },
});