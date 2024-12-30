const express = require('express');
const router = express.Router();
const db = require('../models');

// API to book an appointment
router.post('/', async (req, res) => {
  const { name, phone, date, time } = req.body;

  try {
    // Check if slot is already booked
    const slot = await db.Slot.findOne({ where: { time } });
    if (slot.isBooked) {
      return res.status(400).json({ error: 'Slot already booked' });
    }

    // Create Booking
    const booking = await db.Booking.create({ name, phone, date, slotId: slot.id });

    // Update Slot to Booked
    slot.isBooked = true;
    await slot.save();

    res.json({ message: 'Appointment booked successfully', booking });
  } catch (err) {
    res.status(500).send('Error booking appointment');
  }
});

module.exports = router;
