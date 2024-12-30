module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define('Booking', {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
    });
  
    return Booking;
  };
  