import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '../config';

// ⚠️ Test ke liye — baad mein login se aayega
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNWJjNzkwOGQxNzhjNmNmMTM4NjlkMCIsImlhdCI6MTc4NDQ0OTExNiwiZXhwIjoxNzg1MDUzOTE2fQ.hwD-pyTNmR9kZZ7_Dpkv_t4bA5C_EmLZ_f0y20oLMXM';
const WORKSHOP_ID = '6a5c88ae5d357eb9020c12fb';

export default function RegisteredUsersScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`${API_URL}/workshops/${WORKSHOP_ID}/registrations`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Attendance toggle — present/absent
  const toggleAttendance = async (regId, currentStatus) => {
    const newStatus = currentStatus === 'attended' ? 'registered' : 'attended';
    try {
      const response = await fetch(`${API_URL}/workshops/registrations/${regId}/attendance`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${TOKEN}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await response.json();
      if (data.success) {
        fetchRegistrations(); // list auto-update (0058)
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Update nahi hua');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registered Users</Text>
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
              style={[
                styles.toggleBtn,
                item.status === 'attended' ? styles.presentBtn : styles.absentBtn
              ]}
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
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32' },
  count: { fontSize: 15, color: '#666', marginBottom: 20 },
  card: {
    backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10,
    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#2E7D32'
  },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666', marginTop: 2 },
  location: { fontSize: 13, color: '#888', marginTop: 2 },
  toggleBtn: {
    marginTop: 10, paddingVertical: 8, borderRadius: 8,
    alignItems: 'center'
  },
  presentBtn: { backgroundColor: '#2E7D32' },
  absentBtn: { backgroundColor: '#FF9800' },
  toggleText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 }
});