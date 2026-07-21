const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const Workshop = require('../models/Workshop');

// Public - view workshops WITH SEARCH
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query = { $or: [{ title: regex }, { skillType: regex }, { location: regex }] };
    }
    const workshops = await Workshop.find(query).populate('organizer', 'name email').sort({ date: 1 });
    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create workshop (organizer)
router.post('/', protect, authorize('organizer'), async (req, res) => {
  try {
    const workshop = await Workshop.create({ ...req.body, organizer: req.user._id });
    res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Organizer's own workshops
router.get('/my', protect, authorize('organizer'), async (req, res) => {
  try {
    const workshops = await Workshop.find({ organizer: req.user._id }).sort({ date: 1 });
    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Cancel a registration + SMS (PRJ-A65E-0060)
router.delete('/registrations/:regId', protect, async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const { sendSMS } = require('../utils/smsService');
    const registration = await Registration.findById(req.params.regId)
      .populate('user', 'name email').populate('workshop', 'title');
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });
    await Registration.findByIdAndDelete(req.params.regId);
    sendSMS({
      to: registration.user?.name || 'user',
      message: `Aapki "${registration.workshop?.title}" workshop registration cancel ho gayi hai.`,
    }).catch(() => {});
    res.json({ success: true, message: 'Registration cancelled. SMS sent.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register for a workshop + email + notification (PRJ-A65E-0047)
router.post('/:id/register', protect, async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const Notification = require('../models/Notification');
    const { sendEmail } = require('../utils/emailService');

    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ success: false, message: 'Workshop not found.' });
    const existing = await Registration.findOne({ user: req.user._id, workshop: req.params.id });
    if (existing) return res.status(400).json({ success: false, message: 'Already registered for this workshop.' });
    const registration = await Registration.create({ user: req.user._id, workshop: req.params.id });

    // Fire-and-forget: email + in-app notification
    sendEmail({
      to: req.user.email,
      subject: `Registered: ${workshop.title}`,
      text: `Hi ${req.user.name}, aap "${workshop.title}" workshop ke liye register ho gaye hain. Date: ${new Date(workshop.date).toLocaleDateString()}, Location: ${workshop.location}.`,
    }).catch(() => {});
    Notification.create({
      user: req.user._id,
      title: 'Registration Confirmed',
      message: `Aap "${workshop.title}" ke liye register ho gaye!`,
    }).catch(() => {});

    res.status(201).json({ success: true, message: 'Registered successfully!', data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Registrations for a workshop (organizer)
router.get('/:id/registrations', protect, authorize('organizer'), async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const registrations = await Registration.find({ workshop: req.params.id }).populate('user', 'name email location');
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Attendance summary (PRJ-A65E-0034/0035)
router.get('/:id/attendance-summary', protect, authorize('organizer'), async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const registrations = await Registration.find({ workshop: req.params.id });
    const total = registrations.length;
    const attended = registrations.filter(r => r.status === 'attended').length;
    const notAttended = total - attended;
    const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;
    res.json({ success: true, data: { total, attended, notAttended, attendanceRate } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark attendance (organizer)
router.patch('/registrations/:regId/attendance', protect, authorize('organizer'), async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const { status } = req.body;
    const registration = await Registration.findByIdAndUpdate(req.params.regId, { status: status || 'attended' }, { new: true });
    if (!registration) return res.status(404).json({ success: false, message: 'Registration not found.' });
    res.json({ success: true, message: 'Attendance updated!', data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Edit workshop (PRJ-A65E-0012)
router.put('/:id', protect, authorize('organizer'), async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ success: false, message: 'Workshop not found.' });
    if (workshop.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this workshop.' });
    }
    const updated = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, message: 'Workshop updated!', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete workshop (PRJ-A65E-0013)
router.delete('/:id', protect, authorize('organizer'), async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) return res.status(404).json({ success: false, message: 'Workshop not found.' });
    if (workshop.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this workshop.' });
    }
    await Workshop.findByIdAndDelete(req.params.id);
    const Registration = require('../models/Registration');
    await Registration.deleteMany({ workshop: req.params.id });
    res.json({ success: true, message: 'Workshop deleted!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;