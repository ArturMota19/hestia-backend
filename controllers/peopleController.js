const People = require("../models/People")

exports.register = async (req, res) => {
  try {
    const { name } = req.body;

    const people = await People.create({ name});
    res.status(201).json({ message: 'People registered', user });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};