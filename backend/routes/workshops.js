const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const sendNotification = require('../utils/sendNotification');
const Workshop = require('../models/Workshop');

// Public - view workshops WITH SEARCH
// PRJ-A65E-0052: Search filtering logic (backend)
// Query param: ?search=text  → matches title, skillType, or location
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i'); // case-insensitive
      query = {
        $or: [
          { title: regex },
          { skillType: regex },
          { location: regex },
        ],
      };
    }

    const workshops = await Workshop.find(query)
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Organizer only - create workshop
router.post('/', protect, authorize('organizer'), async (req, res) => {
  try {
    const workshop = await Workshop.create({ ...req.body, organizer: req.user._id });
    res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Organizer only - fetch their own workshops
router.get('/my', protect, authorize('organizer'), async (req, res) => {
  try {
    const workshops = await Workshop.find({ organizer: req.user._id }).sort({ date: 1 });
    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Register for a workshop (participant)
// PRJ-A65E-0032: POST /api/workshops/:id/register
router.post('/:id/register', protect, async (req, res) => {
  try {
    const Registration = require('../models/Registration');

    const workshop = await Workshop.findById(req.params.id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    // Already registered check
    const existing = await Registration.findOne({
      user: req.user._id,
      workshop: req.params.id,
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Already registered for this workshop.' });
    }

    const registration = await Registration.create({
      user: req.user._id,
      workshop: req.params.id,
    });

    await sendNotification(
      req.user,
      'Registration Confirmed! 🎉',
      `Aap "${workshop.title}" workshop ke liye register ho gaye hain.`
    );

    res.status(201).json({ success: true, message: 'Registered successfully!', data: registration });


  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get registrations for a workshop (organizer view)
// PRJ-A65E-0057: Fetch registrations from backend
router.get('/:id/registrations', protect, authorize('organizer'), async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const registrations = await Registration.find({ workshop: req.params.id })
      .populate('user', 'name email location');
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Mark attendance (organizer)
// PRJ-A65E-0010: Save attendance to backend
router.patch('/registrations/:regId/attendance', protect, authorize('organizer'), async (req, res) => {
  try {
    const Registration = require('../models/Registration');
    const { status } = req.body; // 'attended' ya 'registered'
    const registration = await Registration.findByIdAndUpdate(
      req.params.regId,
      { status: status || 'attended' },
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found.' });
    }
    res.json({ success: true, message: 'Attendance updated!', data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
