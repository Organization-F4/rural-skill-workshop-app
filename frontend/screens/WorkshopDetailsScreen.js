// PRJ-A65E-0004: Workshop details screen
// PRJ-A65E-0006: Location map link
// PRJ-A65E-0007 + 0054: Registration button
// PRJ-A65E-0055: Handle registration action
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Linking } from 'react-native';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import { API_URL } from '../config';

export default function WorkshopDetailsScreen({ route }) {
  const { workshop } = route.params;
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  // PRJ-A65E-0006: Open location in Google Maps (no API key needed)
  const openMap = () => {
    const query = encodeURIComponent(workshop.location);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Map nahi khul paya'));
  };

  // PRJ-A65E-0055: Handle registration
  const handleRegister = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/workshops/${workshop._id}/register`);
      setRegistered(true);
      Alert.alert('Success', 'Aap register ho gaye! 🎉');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration nahi hua';
      if (msg.toLowerCase().includes('already')) {
        setRegistered(true);
      }
      Alert.alert('Info', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Workshop Details" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{workshop.title}</Text>

        <View style={styles.infoCard}>
          <Text style={styles.info}>🛠  {workshop.skillType}</Text>
          <Text style={styles.info}>📍  {workshop.location}</Text>
          <Text style={styles.info}>📅  {new Date(workshop.date).toLocaleDateString('hi-IN')}</Text>
          <Text style={styles.info}>👥  Max: {workshop.maxParticipants}</Text>
          {workshop.organizer?.name && (
            <Text style={styles.info}>👤  By: {workshop.organizer.name}</Text>
          )}
        </View>

        {/* PRJ-A65E-0006: View on Map */}
        <TouchableOpacity style={styles.mapBtn} onPress={openMap}>
          <Text style={styles.mapBtnText}>🗺️  View "{workshop.location}" on Map</Text>
        </TouchableOpacity>

        {workshop.description ? (
          <>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{workshop.description}</Text>
          </>
        ) : null}

        <TouchableOpacity
          style={[styles.button, registered && styles.registeredBtn]}
          onPress={handleRegister}
          disabled={loading || registered}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {registered ? '✓ Registered' : 'Register for Workshop'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginBottom: 16 },
  infoCard: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12 },
  info: { fontSize: 15, color: '#444', marginBottom: 8 },
  mapBtn: { backgroundColor: '#E8F5E9', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#2E7D32' },
  mapBtnText: { color: '#2E7D32', fontWeight: '600', fontSize: 14 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  description: { fontSize: 14, color: '#666', lineHeight: 22, marginBottom: 20 },
  button: { backgroundColor: '#2E7D32', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  registeredBtn: { backgroundColor: '#888' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});