const People = require("../models/People")

exports.register = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.users.id;

    const people = await People.create({ name, userId });
    res.status(201).json({ message: "People registered", people });
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

    const count = await People.count({ where: { userId } });

    const peopleData = await People.findAll({
      where: { userId },
      limit,
      offset,
    });

    const people = peopleData.map((person) => ({
      paramName: person.name,
      actuatorSpec: [],
      capacity: null,
      type: "person",
    }));

    res.status(200).json({ people, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllWithoutPage = async (req, res) => {
  try {
    const userId = req.users.id;

    const peopleData = await People.findAll({
      where: { userId },
    });

    res.status(200).json({ peopleData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};