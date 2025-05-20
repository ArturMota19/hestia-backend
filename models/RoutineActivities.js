const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoutineActivities = sequelize.define('routineactivities', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  activityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'activities',
      key: 'id',
    },
  },
  startTime:{
    type: DataTypes.TIME,
    allowNull: false,
  },
  endTime:{
    type: DataTypes.TIME,
    allowNull: false,
  },
  activityRoom:{
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'rooms',
      key: 'id',
    },
  },

});

// RoomActuators.associate = (models) => {
//   RoomActuators.belongsTo(models.HouseRooms, {
//     foreignKey: 'houseRoomId',
//   });
//   RoomActuators.belongsTo(models.Actuators, {
//     foreignKey: 'actuatorId',
//   });
// };


module.exports = RoutineActivities;
