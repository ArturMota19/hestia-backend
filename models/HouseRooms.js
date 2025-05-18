const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HouseRooms = sequelize.define('houserooms', {
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
      model: 'housepresets',
      key: 'id',
    },
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'rooms', 
      key: 'id',
    },
  },
});

HouseRooms.associate = (models) => {
  HouseRooms.belongsTo(models.HousePresets, { foreignKey: "housePresetId" });
  HouseRooms.belongsTo(models.Rooms, { foreignKey: "roomId" });
  HouseRooms.hasMany(models.RoomActuators, { foreignKey: "houseRoomId" });
  HouseRooms.hasMany(models.GraphRooms, {
    foreignKey: "originRoomId",
  });
  HouseRooms.hasMany(models.GraphRooms, {
    foreignKey: "destinationRoomId",
  });
};



module.exports = HouseRooms;
