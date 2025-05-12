const People = require("../models/People")

exports.register = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id

    const people = await People.create({name, userId});
    res.status(201).json({ message: 'People registered', people });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};