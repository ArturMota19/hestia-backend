const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const People = sequelize.define("People", {
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

People.associate = (models) => {
  People.belongsTo(models.User, { foreignKey: 'userId' });
};


module.exports = People;
