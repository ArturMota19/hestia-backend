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