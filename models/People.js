const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const People = sequelize.define("people", {
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
  People.belongsTo(models.Users, { foreignKey: "userId" });
};


module.exports = People;
