const { HousePresets, HouseRooms } = require("../models");
const Rooms = require("../models/Rooms")

exports.register = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const userId = req.users.id;

    const room = await Rooms.create({ name, capacity, userId });
    res.status(201).json({ message: "Room registered", room });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page } = req.params;
    const userId = req.users.id;
    const limit = 6;
    const offset = (page - 1) * limit;

    const count = await Rooms.count({ where: { userId } });

    const roomData = await Rooms.findAll({
      where: { userId },
      limit,
      offset,
    });

    const rooms = roomData.map((eachRoom) => ({
      id: eachRoom.id,
      paramName: eachRoom.name,
      actuatorSpec: [],
      capacity: eachRoom.capacity,
      type: "room",
    }));

    res.status(200).json({ rooms, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getSelf = async (req, res) => {
  try {
    const userId = req.users.id;
    const rooms = await Rooms.findAll({
      where: { userId },
    });
    res.status(200).json({ rooms });
  } catch (e) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users.id;

    const room = await Rooms.findOne({ where: { id, userId } });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const hasReference = await HouseRooms.findOne({where: {roomId: id}})
    if(hasReference){
      return res.status(423).json({ message: "Cannot delete: referenced elsewhere" });
    }

    await Rooms.destroy({ where: { id, userId } });
    res.status(200).json({ message: "Room deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};