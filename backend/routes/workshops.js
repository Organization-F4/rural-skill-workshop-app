const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
const Workshop = require('../models/Workshop');

// Public - view workshops
router.get('/', async (req, res) => {
  try {
    const workshops = await Workshop.find().populate('organizer', 'name email');
    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Organizer only - create workshop (PRJ-A65E-0001 + PRJ-A65E-0002)
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
    const workshops = await Workshop.find({ organizer: req.user._id });
    res.json({ success: true, count: workshops.length, data: workshops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
