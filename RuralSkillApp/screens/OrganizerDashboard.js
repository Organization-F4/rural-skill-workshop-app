// PRJ-A65E-0037: Design dashboard layout
// PRJ-A65E-0038: Fetch organizer workshops
// PRJ-A65E-0039: Display summary stats
// PRJ-A65E-0011: Edit/Delete buttons
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchWorkshops);
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (workshop) => {
    Alert.alert('Delete Workshop', `"${workshop.title}" delete karna hai?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/workshops/${workshop._id}`);
            fetchWorkshops();
          } catch (err) {
            Alert.alert('Error', 'Delete nahi hua');
          }
        },
      },
    ]);
  };

  const totalWorkshops = workshops.length;
  const upcomingWorkshops = workshops.filter(w => new Date(w.date) > new Date()).length;

  return (
    <View style={styles.container}>
      <AppHeader title="Organizer Dashboard" />

      <TouchableOpacity style={styles.createBtn} onPress={() => navigation.navigate('CreateWorkshop')}>
        <Text style={styles.createBtnText}>➕ Create New Workshop</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome, {user?.name}! 👋</Text>

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
                <TouchableOpacity onPress={() => navigation.navigate('RegisteredUsers', { workshop: item })}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDetail}>🛠 {item.skillType}</Text>
                  <Text style={styles.cardDetail}>📍 {item.location}</Text>
                  <Text style={styles.cardDetail}>📅 {new Date(item.date).toLocaleDateString('hi-IN')}</Text>
                  <Text style={styles.tapHint}>👥 View registrations →</Text>
                </TouchableOpacity>

                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => navigation.navigate('EditWorkshop', { workshop: item })}
                  >
                    <Text style={styles.editText}>✏️ Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                    <Text style={styles.deleteText}>🗑 Delete</Text>
                  </TouchableOpacity>
                </View>
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
  createBtn: { backgroundColor: '#2E7D32', margin: 16, marginBottom: 0, padding: 14, borderRadius: 8, alignItems: 'center' },
  createBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  content: { flex: 1, padding: 16 },
  welcome: { fontSize: 16, color: '#555', marginBottom: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 10, alignItems: 'center', elevation: 2 },
  statNum: { fontSize: 28, fontWeight: 'bold', color: '#2E7D32' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 15 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#2E7D32', elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  cardDetail: { fontSize: 13, color: '#666', marginTop: 2 },
  tapHint: { fontSize: 12, color: '#2E7D32', marginTop: 8, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 12, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
  editBtn: { flex: 1, backgroundColor: '#1565C0', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  editText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  deleteBtn: { flex: 1, backgroundColor: '#c62828', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  deleteText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});