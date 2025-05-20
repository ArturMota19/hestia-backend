const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PeopleRoutines = sequelize.define('peopleroutines', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  peopleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'people',
      key: 'id',
    },
  },
  mondayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutine',
      key: 'id',
    },
  },
  tuesdayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutine',
      key: 'id',
    },
  },
  wednesdayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutine',
      key: 'id',
    },
  },
  thursdayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutine',
      key: 'id',
    },
  },
  fridayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutine',
      key: 'id',
    },
  },
  saturdayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutine',
      key: 'id',
    },
  },
  sundayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutine',
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


module.exports = PeopleRoutines;
