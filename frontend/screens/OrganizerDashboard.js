// PRJ-A65E-0037: Design dashboard layout
// PRJ-A65E-0038: Fetch organizer workshops
// PRJ-A65E-0039: Display summary stats
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://10.0.2.2:5000/api';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  // PRJ-A65E-0038: Fetch organizer's own workshops
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const res = await axios.get(`${API_URL}/workshops/my`);
        setWorkshops(res.data.data);
      } catch (err) {
        Alert.alert('Error', 'Workshops load nahi ho sake.');
      } finally {
        setLoading(false);
      }
    };
    fetchWorkshops();
  }, []);

  // PRJ-A65E-0039: Summary stats
  const totalWorkshops = workshops.length;
  const upcomingWorkshops = workshops.filter(w => new Date(w.date) > new Date()).length;

  return (
    <View style={styles.container}>
      {/* PRJ-A65E-0048: Logout button via AppHeader */}
      <AppHeader title="Organizer Dashboard" />

      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome, {user?.name}! 👋</Text>

        {/* PRJ-A65E-0039: Summary Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{totalWorkshops}</Text>
            <Text style={styles.statLabel}>Total Workshops</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{upcomingWorkshops}</Text>
            <Text style={styles.statLabel}>Upcoming</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Aapke Workshops</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 30 }} />
        ) : workshops.length === 0 ? (
          <Text style={styles.empty}>Abhi koi workshop nahi hai.</Text>
        ) : (
          <FlatList
            data={workshops}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDetail}>🛠 {item.skillType}</Text>
                <Text style={styles.cardDetail}>📍 {item.location}</Text>
                <Text style={styles.cardDetail}>📅 {new Date(item.date).toLocaleDateString('hi-IN')}</Text>
                <Text style={styles.cardDetail}>👥 Max: {item.maxParticipants}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, padding: 16 },
  welcome: { fontSize: 16, color: '#555', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 10,
    alignItems: 'center', elevation: 2,
  },
  statNum: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 15 },
  card: {
    backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12,
    borderLeftWidth: 4, borderLeftColor: '#2E7D32', elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  cardDetail: { fontSize: 13, color: '#666', marginTop: 2 },
});
