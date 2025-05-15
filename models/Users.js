const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Users = sequelize.define("users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: "email",
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isSearcherUFBA: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

Users.associate = (models) => {
  Users.hasMany(models.Activities, { foreignKey: "userId" });
  Users.hasMany(models.HousePresets, { foreignKey: "userId" });
  Users.hasMany(models.People, { foreignKey: "userId" });
  Users.hasMany(models.Rooms, { foreignKey: "userId" });
};

module.exports = Users;
