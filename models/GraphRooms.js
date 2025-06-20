const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const GraphRooms = sequelize.define('graphrooms', {
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
  originRoomId:{
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'houserooms',
      key: 'id',
    },
  },
  destinationRoomId:{
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'houserooms',
      key: 'id',
    },
  },
  distance:{
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

GraphRooms.associate = (models) => {
  GraphRooms.belongsTo(models.HousePresets, { foreignKey: "housePresetId" });
  GraphRooms.belongsTo(models.HouseRooms, {
    foreignKey: "originRoomId",
  });
  GraphRooms.belongsTo(models.HouseRooms, {
    foreignKey: "destinationRoomId",
  });
};


module.exports = GraphRooms;
