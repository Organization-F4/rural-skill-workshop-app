// PRJ-A65E-0048: Add logout button to app navigation
// PRJ-A65E-0050: Redirect to login screen after logout
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';

export default function AppHeader({ title }) {
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  // PRJ-A65E-0049 + PRJ-A65E-0050: logout and redirect to Login
  const handleLogout = () => {
    Alert.alert('Logout', 'Kya aap logout karna chahte hain?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();                        // clear token & user state
          navigation.reset({                     // PRJ-A65E-0050: redirect to login
            index: 0,
            routes: [{ name: 'Login' }],
          });
        },
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.right}>
        {user && (
          <>
            <Text style={styles.role}>{user.role}</Text>
            {/* PRJ-A65E-0048: Logout Button */}
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
  role: { fontSize: 12, color: '#c8e6c9', textTransform: 'capitalize' },
  logoutBtn: {
    backgroundColor: '#c62828', paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 6,
  },
  logoutText: { color: '#fff', fontSize: 13, fontWeight: '600' },
});
