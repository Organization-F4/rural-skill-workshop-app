// PRJ-A65E-0008: Registered users list
// PRJ-A65E-0009: Attendance toggle
// PRJ-A65E-0010: Save attendance
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import { API_URL } from '../config';

export default function RegisteredUsersScreen({ route }) {
  const workshop = route.params?.workshop;
  const workshopId = workshop?._id;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(`${API_URL}/workshops/${workshopId}/registrations`);
      setUsers(res.data.data);
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = async (regId, currentStatus) => {
    const newStatus = currentStatus === 'attended' ? 'registered' : 'attended';
    try {
      await axios.patch(`${API_URL}/workshops/registrations/${regId}/attendance`, { status: newStatus });
      fetchRegistrations();
    } catch (error) {
      Alert.alert('Error', 'Update nahi hua');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Registered Users" />
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#2E7D32" /></View>
      ) : (
        <View style={styles.body}>
          <Text style={styles.subtitle}>{workshop?.title}</Text>
          <Text style={styles.count}>Total: {users.length}</Text>
          <FlatList
            data={users}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.name}>{item.user?.name}</Text>
                <Text style={styles.email}>{item.user?.email}</Text>
                <Text style={styles.location}>📍 {item.user?.location}</Text>
                <TouchableOpacity
                  style={[styles.toggleBtn, item.status === 'attended' ? styles.presentBtn : styles.absentBtn]}
                  onPress={() => toggleAttendance(item._id, item.status)}
                >
                  <Text style={styles.toggleText}>
                    {item.status === 'attended' ? '✓ Present' : 'Mark Present'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.empty}>Koi registration nahi hai</Text>}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1, padding: 20 },
  subtitle: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
  count: { fontSize: 15, color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#2E7D32' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666', marginTop: 2 },
  location: { fontSize: 13, color: '#888', marginTop: 2 },
  toggleBtn: { marginTop: 10, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  presentBtn: { backgroundColor: '#2E7D32' },
  absentBtn: { backgroundColor: '#FF9800' },
  toggleText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 }
});