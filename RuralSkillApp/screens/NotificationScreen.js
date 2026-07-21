// PRJ-A65E-0043: Notification Center UI
// PRJ-A65E-0044: Fetch notifications
// PRJ-A65E-0045: Mark as read
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import { API_URL } from '../config';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`);
      setNotifications(res.data.data);
    } catch (error) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.patch(`${API_URL}/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      // ignore
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <AppHeader title="🔔 Notifications" />
      {loading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#2E7D32" /></View>
      ) : (
        <View style={styles.body}>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  body: { flex: 1, padding: 20 },
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