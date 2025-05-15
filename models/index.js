const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const User = require("./User");
const Actuators = require("./Actuators");
const Activities = require("./Activities");
const People = require("./People");
const Rooms = require("./Rooms");
const HousePresets = require("./HousePresets");
const GraphRooms = require("./GraphRooms");
const HouseRooms = require("./HouseRooms"); // Mova esta linha para antes de RoomActuators
const RoomActuators = require("./RoomActuators");

const models = {
  User,
  Activities,
  People,
  Actuators,
  Rooms,
  HousePresets,
  HouseRooms,
  GraphRooms,
  RoomActuators,

};

Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
