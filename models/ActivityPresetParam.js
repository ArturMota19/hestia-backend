const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const ActivityPresetParam = sequelize.define('activitypresetparam', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  presetId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'housepresets',
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
  activityRoom: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'houserooms',
      key: 'id',
    },
  },
});

ActivityPresetParam.associate = (models) => {
  ActivityPresetParam.belongsTo(models.Activities, {
    foreignKey: 'activityId',
    as: 'activity',
  });
  ActivityPresetParam.belongsTo(models.HouseRooms, {
    foreignKey: 'activityRoom',
    as: 'houserooms',
  });
  ActivityPresetParam.belongsTo(models.HousePresets, {
    foreignKey: 'presetId',
    as: 'preset',
  });
  ActivityPresetParam.hasMany(models.ActuatorsActivity, {
    foreignKey: 'activityPresetParamId',
    as: 'actuatorsActivity',
  });
  ActivityPresetParam.hasMany(models.OtherActivities, {
    foreignKey: 'activityPresetParamId',
    as: 'otherActivities',
  });
};

module.exports = ActivityPresetParam;
