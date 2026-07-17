import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function OrganizerDashboard() {
  // Abhi dummy data — baad mein API se aayega
  const registrations = [
    { id: '1', name: 'Ram Kumar', workshop: 'Tailoring', location: 'Patna' },
    { id: '2', name: 'Sita Devi', workshop: 'Carpentry', location: 'Saharsa' },
    { id: '3', name: 'Mohan Lal', workshop: 'Digital Literacy', location: 'Gaya' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Organizer Dashboard</Text>
      <Text style={styles.count}>
        Total Registrations: {registrations.length}
      </Text>

      <FlatList
        data={registrations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.workshop}>{item.workshop}</Text>
            <Text style={styles.location}>📍 {item.location}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 10 },
  count: { fontSize: 16, color: '#555', marginBottom: 20 },
  card: {
    backgroundColor: '#f5f5f5', padding: 15,
    borderRadius: 10, marginBottom: 12,
    borderLeftWidth: 4, borderLeftColor: '#2E7D32'
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  workshop: { fontSize: 14, color: '#666', marginTop: 4 },
  location: { fontSize: 13, color: '#888', marginTop: 4 }
});