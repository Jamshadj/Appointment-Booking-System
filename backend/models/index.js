const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import Models
db.Slot = require('./slot')(sequelize, Sequelize);
db.Booking = require('./booking')(sequelize, Sequelize);

// Define Associations
db.Slot.hasMany(db.Booking, { foreignKey: 'slotId' });
db.Booking.belongsTo(db.Slot, { foreignKey: 'slotId' });

module.exports = db;
