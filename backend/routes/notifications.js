const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');

// Create notification (for testing)
// POST /api/notifications
router.post('/', protect, async (req, res) => {
  try {
    const notification = await Notification.create({
      user: req.user._id,
      title: req.body.title,
      message: req.body.message
    });
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get my notifications
// PRJ-A65E-0044: Fetch notifications from backend
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark notification as read
// PRJ-A65E-0045: Mark notifications as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found.' });
    }
    res.json({ success: true, message: 'Marked as read!', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PRJ-A65E-0014: Save user's Expo push token
// POST /api/notifications/token
router.post('/token', protect, async (req, res) => {
  try {
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user._id, { pushToken: req.body.pushToken });
    res.json({ success: true, message: 'Push token saved!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
