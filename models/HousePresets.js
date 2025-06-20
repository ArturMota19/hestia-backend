const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const HousePresets = sequelize.define("housepresets", {
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
});

HousePresets.associate = (models) => {
  HousePresets.belongsTo(models.Users, { foreignKey: "userId" });
  HousePresets.hasMany(models.HouseRooms, { foreignKey: "housePresetId" });
  HousePresets.hasMany(models.GraphRooms, { foreignKey: "housePresetId" });
  HousePresets.hasMany(models.PeopleRoutines, { foreignKey: "housePresetId" })
};


module.exports = HousePresets;
