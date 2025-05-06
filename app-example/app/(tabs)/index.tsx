import { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [sharing, setSharing] = useState(false);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }

    const current = await Location.getCurrentPositionAsync({});
    setLocation(current);
  };

  useEffect(() => {
    if (sharing) {
      getLocation();
    } else {
      setLocation(null);
    }
  }, [sharing]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Location Sharing</Text>
      <Button
        title={sharing ? 'Stop Sharing' : 'Start Sharing'}
        onPress={() => setSharing(!sharing)}
      />
      {location && (
        <Text style={styles.coords}>
          Latitude: {location.coords.latitude.toFixed(5)}{'\n'}
          Longitude: {location.coords.longitude.toFixed(5)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  coords: { marginTop: 20, textAlign: 'center' },
});