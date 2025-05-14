const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const User = require('./User');
const Activities = require('./Activities');
const HousePresets = require('./HousePresets');
const People = require('./People');
const Rooms = require('./Rooms');
const GraphRooms = require('./GraphRooms');
const HouseRooms = require('./HouseRooms');
const RoomActuators = require('./RoomActuators');
const Actuators = require('./Actuators');

const models = {
  User,
  Activities,
  HousePresets,
  People,
  Rooms,
  GraphRooms,
  HouseRooms,
  RoomActuators,
  Actuators,
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models); 
  }
});

module.exports = {
  sequelize,
  Sequelize,
  ...models,
};
