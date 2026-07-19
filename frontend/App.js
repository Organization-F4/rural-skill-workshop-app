import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisteredUsersScreen from './screens/RegisteredUsersScreen';
import NotificationScreen from './screens/NotificationScreen';

export default function App() {
  const [screen, setScreen] = useState('login');

  const renderScreen = () => {
    if (screen === 'login') return <LoginScreen />;
    if (screen === 'users') return <RegisteredUsersScreen />;
    if (screen === 'notifications') return <NotificationScreen />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Screen area */}
      <View style={styles.screenArea}>
        {renderScreen()}
      </View>

      {/* Bottom navigation */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setScreen('login')}
        >
          <Text style={[styles.navText, screen === 'login' && styles.active]}>
            🔑{'\n'}Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setScreen('users')}
        >
          <Text style={[styles.navText, screen === 'users' && styles.active]}>
            👥{'\n'}Users
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setScreen('notifications')}
        >
          <Text style={[styles.navText, screen === 'notifications' && styles.active]}>
            🔔{'\n'}Alerts
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  screenArea: { flex: 1 },
  navbar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    paddingBottom: 20,
    paddingTop: 10
  },
  navBtn: { flex: 1, alignItems: 'center' },
  navText: { fontSize: 13, textAlign: 'center', color: '#999' },
  active: { color: '#2E7D32', fontWeight: 'bold' }
});