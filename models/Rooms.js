const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rooms = sequelize.define('Rooms', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Rooms;
