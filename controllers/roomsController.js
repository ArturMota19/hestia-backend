const Rooms = require("../models/Rooms")

exports.register = async (req, res) => {
  try {
    const { name, capacity } = req.body;
    const userId = req.user.id

    const room = await Rooms.create({ name, capacity, userId });
    res.status(201).json({ message: 'Room registered', room });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};