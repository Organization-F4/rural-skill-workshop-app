import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'participant', location: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, password, role, location } = form;
    if (!name || !email || !password || !location) {
      Alert.alert('Error', 'Sab fields bharo.');
      return;
    }
    setLoading(true);
    try {
      await register(name, email.trim(), password, role, location);
      // Navigation automatically handled by AppNavigator (PRJ-A65E-0003)
    } catch (err) {
      Alert.alert('Registration Failed', err.response?.data?.message || 'Kuch galat hua.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌾 Register</Text>

      {['name', 'email', 'location'].map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
          value={form[field]}
          onChangeText={(val) => setForm({ ...form, [field]: val })}
          autoCapitalize={field === 'email' ? 'none' : 'words'}
          keyboardType={field === 'email' ? 'email-address' : 'default'}
        />
      ))}

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={form.password}
        onChangeText={(val) => setForm({ ...form, password: val })}
      />

      <View style={styles.roleRow}>
        {['participant', 'organizer'].map((r) => (
          <TouchableOpacity
            key={r}
            style={[styles.roleBtn, form.role === r && styles.roleBtnActive]}
            onPress={() => setForm({ ...form, role: r })}
          >
            <Text style={[styles.roleText, form.role === r && styles.roleTextActive]}>
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Register</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#2E7D32', marginBottom: 24 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, marginBottom: 15, fontSize: 16 },
  roleRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  roleBtn: { flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#2E7D32', alignItems: 'center' },
  roleBtnActive: { backgroundColor: '#2E7D32' },
  roleText: { color: '#2E7D32', fontWeight: '600' },
  roleTextActive: { color: '#fff' },
  button: { backgroundColor: '#2E7D32', padding: 15, borderRadius: 8, alignItems: 'center', minHeight: 50, justifyContent: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  link: { textAlign: 'center', marginTop: 15, color: '#2E7D32' }
});
