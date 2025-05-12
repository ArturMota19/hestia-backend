const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Activities = sequelize.define('Activities', {
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
  errorValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },

});

module.exports = Activities;
