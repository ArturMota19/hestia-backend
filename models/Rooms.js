const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Rooms = sequelize.define("rooms", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "users",
      key: "id",
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Rooms.associate = (models) => {
  Rooms.belongsTo(models.Users, { foreignKey: "userId" });
  Rooms.hasMany(models.HouseRooms, { foreignKey: 'roomId' });
};


module.exports = Rooms;
