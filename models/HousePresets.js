const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HousePresets = sequelize.define('HousePresets', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users', // Assumes there is a Users model
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});

module.exports = HousePresets;
