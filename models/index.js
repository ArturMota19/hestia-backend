const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const Users = require("./Users");
const Actuators = require("./Actuators");
const Activities = require("./Activities");
const People = require("./People");
const Rooms = require("./Rooms");
const HousePresets = require("./HousePresets");
const GraphRooms = require("./GraphRooms");
const HouseRooms = require("./HouseRooms"); // Mova esta linha para antes de RoomActuators
const RoomActuators = require("./RoomActuators");
const DayRoutine = require("./DayRoutine")
const PeopleRoutines = require("./PeopleRoutines")
const OtherActivities = require("./OtherActivities")
const ActivityPresetParam = require("./ActivityPresetParam")
const RoutineActivities = require("./RoutineActivities")
const ActuatorsActivity = require("./ActuatorsActivity")
const PeoplePriority = require("./PeoplePriority")

const models = {
  Users,
  Activities,
  People,
  Actuators,
  Rooms,
  HousePresets,
  HouseRooms,
  GraphRooms,
  RoomActuators,
  DayRoutine,
  ActivityPresetParam,
  PeopleRoutines,
  OtherActivities,
  RoutineActivities,
  ActuatorsActivity,
  PeoplePriority
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
