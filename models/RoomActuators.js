const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoomActuators = sequelize.define('roomactuators', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  houseRoomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'houserooms',
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
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

RoomActuators.associate = (models) => {
  RoomActuators.belongsTo(models.HouseRooms, {
    foreignKey: 'houseRoomId',
    as: 'houseRoom',
  });
  RoomActuators.belongsTo(models.Actuators, {
    foreignKey: 'actuatorId',
    as: 'actuator',
  });
};


module.exports = RoomActuators;
