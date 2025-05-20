const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OtherActivities = sequelize.define('otheractivities', {
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
  activityId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'activities',
      key: 'id',
    },
  },
  probability: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }
});

// RoomActuators.associate = (models) => {
//   RoomActuators.belongsTo(models.HouseRooms, {
//     foreignKey: 'houseRoomId',
//   });
//   RoomActuators.belongsTo(models.Actuators, {
//     foreignKey: 'actuatorId',
//   });
// };


module.exports = OtherActivities;
