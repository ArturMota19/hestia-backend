const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ActuatorsActivity = sequelize.define('actuatorsactivity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  routineActivitiesId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'routineactivities',
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

ActuatorsActivity.associate = (models) => {
  ActuatorsActivity.belongsTo(models.RoutineActivities, {
    foreignKey: 'routineActivitiesId',
  });
  ActuatorsActivity.belongsTo(models.Actuators, {
    foreignKey: 'actuatorId',
  });
};


module.exports = ActuatorsActivity;
