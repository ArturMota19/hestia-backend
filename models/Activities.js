const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Activities = sequelize.define("activities", {
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
  errorValue: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Activities.associate = (models) => {
  Activities.belongsTo(models.User, { foreignKey: 'userId' });
};


module.exports = Activities;
