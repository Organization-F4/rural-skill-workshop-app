import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';

export default function WorkshopListScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="🌾 Workshops" />
      <View style={styles.content}>
        <Text style={styles.text}>Workshop list yahan aayegi... (PRJ-A65E-0051)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { color: '#888', fontSize: 15 }
});
