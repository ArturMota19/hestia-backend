const Activities = require("../models/Activities")

exports.register = async (req, res) => {
  try {
    const { name, errorValue, color } = req.body;
    const userId = req.user.id

    const activitie = await Activities.create({ name, errorValue, color, userId });
    res.status(201).json({ message: 'Activitie registered', activitie });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};