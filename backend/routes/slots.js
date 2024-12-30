const express = require('express');
const router = express.Router();
const db = require('../models');

// API to fetch available slots for a specific date
router.get('/:date', async (req, res) => {
  const { date } = req.params;
  try {
    const slots = await db.Slot.findAll({
      where: { isBooked: false },
      include: [{ model: db.Booking, where: { date }, required: false }],
    });
    res.json(slots);
  } catch (err) {
    console.error('Error fetching slots:', err); // Log errors if any
    res.status(500).send('Error fetching slots');
  }
});


module.exports = router;
