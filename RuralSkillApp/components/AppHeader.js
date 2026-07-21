// PRJ-A65E-0048: Logout button
// Bell button → Notifications
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function AppHeader({ title }) {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert('Logout', 'Kya aap logout karna chahte hain?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const goNotifications = () => {
    navigation.navigate('Notifications');
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>
        {user && (
          <>
            <TouchableOpacity onPress={goNotifications} style={styles.bellBtn}>
              <Text style={styles.bell}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: '#2E7D32',
  },
  title: { fontSize: 18, fontWeight: 'bold', color: '#fff', flex: 1 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bellBtn: { padding: 4 },
  bell: { fontSize: 20 },
  logoutBtn: { backgroundColor: '#c62828', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  logoutText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});