const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoutineActivities = sequelize.define('routineactivities', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  dayRoutineId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'dayroutines',
      key: 'id',
    },
  },
  activityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'activities',
      key: 'id',
    },
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  activityRoom: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'houserooms',
      key: 'id',
    },
  },
});

RoutineActivities.associate = (models) => {
  RoutineActivities.belongsTo(models.DayRoutine, {
    foreignKey: 'dayRoutineId',
    as: 'dayRoutine',
  });
  RoutineActivities.belongsTo(models.Activities, {
    foreignKey: 'activityId',
    as: 'activity',
  });
  RoutineActivities.belongsTo(models.HouseRooms, {
    foreignKey: 'activityRoom',
    as: 'houserooms',
  });
};

module.exports = RoutineActivities;
