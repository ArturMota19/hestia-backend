const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HouseRooms = sequelize.define('HouseRooms', {
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
      model: 'HousePresets',
      key: 'id',
    },
  },
  roomId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Rooms', 
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
    as: "originLinks",
  });
  HouseRooms.hasMany(models.GraphRooms, {
    foreignKey: "destinationRoomId",
    as: "destinationLinks",
  });
};



module.exports = HouseRooms;
