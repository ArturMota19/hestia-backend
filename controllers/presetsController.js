const HousePresets = require("../models/HousePresets")
const HouseActuators = require("../models/HouseActuators")
const HouseRooms = require("../models/HouseRooms")

const RoomActuators = require("../models/RoomActuators")
const GraphRooms = require("../models/GraphRooms")


exports.register = async (req, res) => {
  try {
    const { name, rooms, graphRooms } = req.body;
    const userId = req.user.id

    // const room = await Rooms.create({ name, capacity, userId });
    // res.status(201).json({ message: 'Room registered', room });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};
