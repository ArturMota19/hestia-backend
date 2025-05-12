const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const People = sequelize.define('People', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

});

module.exports = People;
