const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DayRoutine = sequelize.define('dayroutine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  day: {
    type: DataTypes.ENUM(
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ),
    allowNull: false,
  },
});

// RoomActuators.associate = (models) => {
//   RoomActuators.belongsTo(models.HouseRooms, {
//     foreignKey: 'houseRoomId',
//   });
//   RoomActuators.belongsTo(models.Actuators, {
//     foreignKey: 'actuatorId',
//   });
// };


module.exports = DayRoutine;
