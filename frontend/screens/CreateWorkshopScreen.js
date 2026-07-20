import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, ScrollView
} from 'react-native';
import axios from 'axios';
import AppHeader from '../components/AppHeader';
import { API_URL } from '../config';

export default function CreateWorkshopScreen() {
  const [form, setForm] = useState({
    title: '', skillType: 'tailoring', location: '', date: '', description: ''
  });
  const [loading, setLoading] = useState(false);

  const skills = ['tailoring', 'carpentry', 'digital literacy', 'farming', 'other'];

  const handleCreate = async () => {
    const { title, location, date } = form;
    if (!title || !location || !date) {
      Alert.alert('Error', 'Title, location aur date bharo.');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API_URL}/workshops`, form);
      Alert.alert('Success', 'Workshop ban gaya! 🎉');
      setForm({ title: '', skillType: 'tailoring', location: '', date: '', description: '' });
    } catch (err) {
      Alert.alert('Failed', err.response?.data?.message || 'Workshop nahi bana');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title="➕ Create Workshop" />
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Workshop Title</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Tailoring Basics"
          value={form.title}
          onChangeText={(v) => setForm({ ...form, title: v })}
        />

        <Text style={styles.label}>Skill Type</Text>
        <View style={styles.skillRow}>
          {skills.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.skillChip, form.skillType === s && styles.skillActive]}
              onPress={() => setForm({ ...form, skillType: s })}
            >
              <Text style={[styles.skillText, form.skillType === s && styles.skillTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Patna"
          value={form.location}
          onChangeText={(v) => setForm({ ...form, location: v })}
        />

        <Text style={styles.label}>Date (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2026-08-15"
          value={form.date}
          onChangeText={(v) => setForm({ ...form, date: v })}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Workshop ke baare mein..."
          value={form.description}
          onChangeText={(v) => setForm({ ...form, description: v })}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleCreate} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Create Workshop</Text>}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, fontSize: 15 },
  textarea: { height: 80, textAlignVertical: 'top' },
  skillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { borderWidth: 1, borderColor: '#2E7D32', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  skillActive: { backgroundColor: '#2E7D32' },
  skillText: { color: '#2E7D32', fontSize: 13 },
  skillTextActive: { color: '#fff' },
  button: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});