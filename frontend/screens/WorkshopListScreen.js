import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, TextInput, FlatList, StyleSheet,
  ActivityIndicator, TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AppHeader from '../components/AppHeader';
import { API_URL } from '../config';

export default function WorkshopListScreen() {
  const navigation = useNavigation();
  const [workshops, setWorkshops] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchWorkshops = useCallback(async (searchText = '') => {
    setLoading(true);
    try {
      const url = searchText.trim()
        ? `${API_URL}/workshops?search=${encodeURIComponent(searchText.trim())}`
        : `${API_URL}/workshops`;
      const res = await axios.get(url);
      setWorkshops(res.data.data);
    } catch (err) {
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkshops();
  }, [fetchWorkshops]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWorkshops(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search, fetchWorkshops]);

  const renderWorkshop = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('WorkshopDetails', { workshop: item })}
    >
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardDetail}>🛠 {item.skillType}</Text>
      <Text style={styles.cardDetail}>📍 {item.location}</Text>
      <Text style={styles.cardDetail}>📅 {new Date(item.date).toLocaleDateString('hi-IN')}</Text>
      {item.organizer?.name && (
        <Text style={styles.cardOrganizer}>By: {item.organizer.name}</Text>
      )}
      <Text style={styles.tapHint}>Tap for details →</Text>
    </TouchableOpacity>
  );

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🔍</Text>
        <Text style={styles.emptyTitle}>
          {search.trim() ? 'Koi workshop nahi mila' : 'Abhi koi workshop nahi hai'}
        </Text>
        <Text style={styles.emptyText}>
          {search.trim()
            ? `"${search}" ke liye koi result nahi. Kuch aur try karo.`
            : 'Jald hi naye workshops add honge.'}
        </Text>
        {search.trim() ? (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setSearch('')}>
            <Text style={styles.clearBtnText}>Search clear karo</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="🌾 Workshops" />

      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Title, skill ya location se search karo..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={workshops}
          keyExtractor={(item) => item._id}
          renderItem={renderWorkshop}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={workshops.length === 0 ? { flex: 1 } : { padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchWrapper: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    margin: 16, marginBottom: 8, paddingHorizontal: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#e0e0e0',
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15 },
  clearIcon: { fontSize: 16, color: '#999', paddingHorizontal: 6 },
  card: {
    backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12,
    borderLeftWidth: 4, borderLeftColor: '#2E7D32', elevation: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 6 },
  cardDetail: { fontSize: 13, color: '#666', marginTop: 2 },
  cardOrganizer: { fontSize: 12, color: '#999', marginTop: 6, fontStyle: 'italic' },
  tapHint: { fontSize: 12, color: '#2E7D32', marginTop: 8, fontWeight: '600' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#555', marginBottom: 8, textAlign: 'center' },
  emptyText: { fontSize: 14, color: '#888', textAlign: 'center', lineHeight: 20 },
  clearBtn: {
    marginTop: 16, backgroundColor: '#2E7D32', paddingHorizontal: 20,
    paddingVertical: 10, borderRadius: 8,
  },
  clearBtnText: { color: '#fff', fontWeight: '600' },
});