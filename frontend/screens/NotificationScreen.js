import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { API_URL } from '../config';

// ⚠️ Test ke liye — baad mein login se aayega
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNWJjNzkwOGQxNzhjNmNmMTM4NjlkMCIsImlhdCI6MTc4NDQ0OTExNiwiZXhwIjoxNzg1MDUzOTE2fQ.hwD-pyTNmR9kZZ7_Dpkv_t4bA5C_EmLZ_f0y20oLMXM';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      });
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${TOKEN}` }
      });
      const data = await response.json();
      if (data.success) {
        fetchNotifications(); // list refresh
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔔 Notifications</Text>
      <Text style={styles.count}>{unreadCount} unread</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, item.read ? styles.readCard : styles.unreadCard]}
            onPress={() => !item.read && markAsRead(item._id)}
          >
            <View style={styles.row}>
              <Text style={styles.notifTitle}>{item.title}</Text>
              {!item.read && <View style={styles.dot} />}
            </View>
            <Text style={styles.message}>{item.message}</Text>
            {!item.read && <Text style={styles.tapHint}>Tap to mark as read</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Koi notification nahi hai</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32' },
  count: { fontSize: 14, color: '#FF9800', marginBottom: 20, fontWeight: 'bold' },
  card: { padding: 15, borderRadius: 10, marginBottom: 12 },
  unreadCard: { backgroundColor: '#E8F5E9', borderLeftWidth: 4, borderLeftColor: '#2E7D32' },
  readCard: { backgroundColor: '#f5f5f5', borderLeftWidth: 4, borderLeftColor: '#ccc' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#2E7D32' },
  message: { fontSize: 14, color: '#666', marginTop: 5 },
  tapHint: { fontSize: 11, color: '#2E7D32', marginTop: 6, fontStyle: 'italic' },
  empty: { textAlign: 'center', color: '#999', marginTop: 40 }
});