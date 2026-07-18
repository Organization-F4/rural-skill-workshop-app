const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');
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

module.exports = router;
