const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GraphRooms = sequelize.define('GraphRooms', {
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
  originRoomId:{
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'HouseRooms',
      key: 'id',
    },
  },
  destinationRoomId:{
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'HouseRooms',
      key: 'id',
    },
  },
  distance:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = GraphRooms;
