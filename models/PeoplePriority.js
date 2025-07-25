const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PeoplePriority = sequelize.define('peoplepriority', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'id',
    },
  },
  peopleRoutinesId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'peopleroutines',
      key: 'id',
    },
  },
  actuatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'actuators',
      key: 'id',
    },
  },
  switch_led: {
    type: DataTypes.ENUM('ON', 'OFF'),
    allowNull: true,
  },
  bright_value_v2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 1000,
    },
  },
  temp_value_v2: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 1000,
    },
  },
  switch: {
    type: DataTypes.ENUM('ON', 'OFF'),
    allowNull: true,
  },
  switch_1: {
    type: DataTypes.ENUM('ON', 'OFF'),
    allowNull: true,
  },
  sound_volume: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100,
    },
  },
  temp_set: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 16,
      max: 30,
    },
  },
  mode: {
    type: DataTypes.ENUM('COLL', 'HOT', 'WET', 'WIND', 'AUTO'),
    allowNull: true,
  },
  presence_state: {
    type: DataTypes.ENUM('ON', 'OFF'),
    allowNull: true,
  },
  human_motion_state: {
    type: DataTypes.ENUM('NONE', 'SMALL_MOVE', 'LARGER_MOVE'),
    allowNull: true,
  },
});

// PeoplePriority.associate = (models) => {
//   PeoplePriority.belongsTo(models.ActivityPresetParam, {
//     foreignKey: 'activityPresetParamId',
//   });
//   PeoplePriority.belongsTo(models.Actuators, {
//     foreignKey: 'actuatorId',
//   });
// };


module.exports = PeoplePriority;
