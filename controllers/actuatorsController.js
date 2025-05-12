const People = require("../models/People")

exports.getAll = async (req, res) => {
  try {
    const count = await People.count({ where: { userId } });

    const peopleData = await People.findAll({});

    const people = peopleData.map(person => ({
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
}