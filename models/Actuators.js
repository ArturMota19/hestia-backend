const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Actuators = sequelize.define('Actuators', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  hasSwitch: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasBrightValue: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasTempValue: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasSoundVolume: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasTempSet: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasMode: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  hasHumanMotionState: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Actuators;
