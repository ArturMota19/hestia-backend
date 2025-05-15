const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('users', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: 'email'
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
  }
});

User.associate = (models) => {
  User.hasMany(models.Activities, { foreignKey: 'userId' });
  User.hasMany(models.HousePresets, { foreignKey: 'userId' });
  User.hasMany(models.People, { foreignKey: 'userId' });
  User.hasMany(models.Rooms, { foreignKey: 'userId' });
};


module.exports = User;
