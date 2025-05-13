const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HouseRooms = sequelize.define('HouseRooms', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  housePresetId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'HousePresets',
      key: 'id',
    },
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Rooms', 
      key: 'id',
    },
  },
  RoomActuators: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'RoomActuators', 
      key: 'id',
    },
  }
});

module.exports = HouseRooms;
