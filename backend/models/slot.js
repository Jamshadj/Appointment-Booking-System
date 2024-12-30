module.exports = (sequelize, Sequelize) => {
    const Slot = sequelize.define('Slot', {
      time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isBooked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  
    return Slot;
  };
  