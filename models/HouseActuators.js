const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HouseActuators = sequelize.define('HouseActuators', {
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
  actuatorId: {
    type: DataTypes.UUID,
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
  switch: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  brightValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 1000,
    },
  },
  tempValue: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 1000,
    },
  },
  soundVolume: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      max: 100,
    },
  },
  tempSet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 16,
      max: 30,
    },
  },
  mode: {
    type: DataTypes.ENUM('off', 'on', 'auto', 'manual'),
    allowNull: false,
  },
  humanMotionState: {
    type: DataTypes.ENUM('detected', 'not_detected'),
    allowNull: false,
  },
});

module.exports = HouseActuators;
