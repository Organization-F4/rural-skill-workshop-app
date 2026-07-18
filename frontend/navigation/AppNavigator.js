// PRJ-A65E-0003: Protect frontend navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

// Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OrganizerDashboard from '../screens/OrganizerDashboard';
import WorkshopListScreen from '../screens/WorkshopListScreen';

const Stack = createNativeStackNavigator();

// PRJ-A65E-0003: Auth screens (not logged in)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// PRJ-A65E-0003: Participant screens
const ParticipantStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WorkshopList" component={WorkshopListScreen} />
  </Stack.Navigator>
);

// PRJ-A65E-0003: Organizer screens
const OrganizerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={OrganizerDashboard} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useAuth();

  // Show loader while checking saved token
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!user ? (
        // Not logged in → show auth screens
        <AuthStack />
      ) : user.role === 'organizer' ? (
        // Organizer → show organizer dashboard
        <OrganizerStack />
      ) : (
        // Participant → show workshop list
        <ParticipantStack />
      )}
    </NavigationContainer>
  );
}
