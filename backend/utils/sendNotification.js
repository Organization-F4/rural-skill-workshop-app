// PRJ-A65E-0014: Push Notification Service integration (Expo)
// Yeh helper DB mein notification save karta hai + Expo push bhejta hai

const Notification = require('../models/Notification');

/**
 * Ek user ko notification bhejta hai:
 *  1. Database mein save karta hai (NotificationScreen mein dikhega)
 *  2. Agar user ka pushToken hai, toh Expo ke through phone pe push bhejta hai
 */
async function sendNotification(user, title, message) {
  try {
    // 1. DB mein save karo (in-app notification ke liye)
    await Notification.create({
      user: user._id,
      title,
      message,
    });

    // 2. Push token nahi hai toh yahin ruk jao (in-app kaafi hai)
    if (!user.pushToken) return;

    // 3. Expo Push API ko call karo
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: user.pushToken,
        sound: 'default',
        title,
        body: message,
      }),
    });
  } catch (error) {
    console.error('Notification bhejne mein error:', error.message);
  }
}

module.exports = sendNotification;