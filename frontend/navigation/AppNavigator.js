// PRJ-A65E-0003: Protect frontend navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import OrganizerDashboard from '../screens/OrganizerDashboard';
import WorkshopListScreen from '../screens/WorkshopListScreen';
import WorkshopDetailsScreen from '../screens/WorkshopDetailsScreen';
import CreateWorkshopScreen from '../screens/CreateWorkshopScreen';
import RegisteredUsersScreen from '../screens/RegisteredUsersScreen';
import NotificationScreen from '../screens/NotificationScreen';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

const ParticipantStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="WorkshopList" component={WorkshopListScreen} />
    <Stack.Screen name="WorkshopDetails" component={WorkshopDetailsScreen} />
    <Stack.Screen name="Notifications" component={NotificationScreen} />
  </Stack.Navigator>
);

const OrganizerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={OrganizerDashboard} />
    <Stack.Screen name="CreateWorkshop" component={CreateWorkshopScreen} />
    <Stack.Screen name="RegisteredUsers" component={RegisteredUsersScreen} />
    <Stack.Screen name="Notifications" component={NotificationScreen} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  const { user, loading } = useAuth();

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
        <AuthStack />
      ) : user.role === 'organizer' ? (
        <OrganizerStack />
      ) : (
        <ParticipantStack />
      )}
    </NavigationContainer>
  );
}