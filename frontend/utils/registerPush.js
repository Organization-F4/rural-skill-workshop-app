// PRJ-A65E-0014: Local notification setup (Expo Go compatible)
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Notification aane pe app mein kaise dikhe
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Notification permission maangta hai + Android channel set karta hai.
 * Login ke baad ek baar call karo.
 */
export async function registerForPushNotifications() {
  try {
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Notification permission nahi mili');
      return;
    }

    // Android ke liye channel zaroori hai
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    console.log('Local notifications ready ✅');
  } catch (error) {
    console.log('Notification setup error:', error.message);
  }
}

/**
 * PRJ-A65E-0015 + 0016: Turant ek local notification dikhata hai.
 * Workshop register hone pe ise call karo.
 */
export async function showLocalNotification(title, body) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, sound: 'default' },
      trigger: null, // null = abhi turant dikhao
    });
  } catch (error) {
    console.log('Notification show error:', error.message);
  }
}