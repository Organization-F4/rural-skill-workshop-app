import { registerForPushNotifications } from '../utils/registerPush';
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        if (savedToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.user);
          setToken(savedToken);
        }
      } catch {
        await AsyncStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const register = async (name, email, password, role, location) => {
    const res = await axios.post(`${API_URL}/auth/register`, { name, email, password, role, location });
    const { token: newToken, user: newUser } = res.data;
    await AsyncStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { token: newToken, user: newUser } = res.data;
    await AsyncStorage.setItem('token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
    registerForPushNotifications(); // PRJ-A65E-0014: push token register karo
    return newUser;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};