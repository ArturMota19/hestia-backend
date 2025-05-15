const Activities = require("../models/Activities")

exports.register = async (req, res) => {
  try {
    const { name, errorValue, color } = req.body;
    const userId = req.users.id;

    const activitie = await Activities.create({
      name,
      errorValue,
      color,
      userId,
    });
    res.status(201).json({ message: "Activitie registered", activitie });
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

    const count = await Activities.count({ where: { userId } });

    const activitieData = await Activities.findAll({
      where: { userId },
      limit,
      offset,
    });

    const activity = activitieData.map((activityEach) => ({
      paramName: activityEach.name,
      actuatorSpec: [],
      capacity: null,
      type: "activity",
    }));

    res.status(200).json({ activities: activity, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};