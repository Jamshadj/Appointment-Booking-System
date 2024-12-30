const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Import Routes
const slotRoutes = require('./routes/slots');
const bookingRoutes = require('./routes/bookings');

app.use('/slots', slotRoutes);
app.use('/bookings', bookingRoutes);

// Sync Database and Start Server
db.sequelize.sync({ force: true }).then(async () => {
  console.log('Database synced');

  // Seed Slots
  const slots = [];
  for (let hour = 10; hour <= 16; hour++) {
    for (let minute of [0, 30]) {
      if (hour === 13) continue;
      slots.push({ time: `${hour}:${minute === 0 ? '00' : '30'}` });
    }
  }
  await db.Slot.bulkCreate(slots);

  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});
