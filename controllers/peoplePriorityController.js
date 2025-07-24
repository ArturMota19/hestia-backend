

exports.register = async (req, res) => {
  try {
    const { peopleRoutinesId, preferences, priority  } = req.body;
    const userId = req.users.id;

    // const people = await People.create({ name, userId });
    res.status(201).json({ message: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};