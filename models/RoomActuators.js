const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoomActuators = sequelize.define('RoomActuators', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  houseRoomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'HouseRooms',
      key: 'id',
    },
  },
  actuatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Actuators', 
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = RoomActuators;
