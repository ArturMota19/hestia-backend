const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoutineActivities = sequelize.define('routineactivities', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  activityPresetParam: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'activitypresetparams',
      key: 'id',
    },
  },
  dayRoutineId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'dayroutines',
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

});

RoutineActivities.associate = (models) => {
  RoutineActivities.belongsTo(models.DayRoutine, {
    foreignKey: 'dayRoutineId',
    as: 'dayRoutine',
  });
  RoutineActivities.belongsTo(models.ActivityPresetParam, {
    foreignKey: 'activityPresetParam',
    as: 'activityPresetParamAssociation',
  });
};

module.exports = RoutineActivities;
