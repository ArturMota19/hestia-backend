const Actuators = require("../models/Actuators")

exports.getAll = async (req, res) => {
  try {
    const { page } = req.params;
    const limit = 6;
    const offset = (page - 1) * limit;

    const count = await Actuators.count({});

    const actuatorData = await Actuators.findAll({
      limit,
      offset,
    });

    const actuators = actuatorData.map(activityEach => ({
      paramName: activityEach.name,
      actuatorSpec: [
      { hasBrightValue: activityEach.hasBrightValue },
      { hasSwitch: activityEach.hasSwitch },
      { hasTempValue: activityEach.hasTempValue },
      { hasSoundVolume: activityEach.hasSoundVolume },
      { hasTempSet: activityEach.hasTempSet },
      { hasMode: activityEach.hasMode },
      { hasHumanMotionState: activityEach.hasHumanMotionState },
      ],
      capacity: null,
      type: "actuator",
    }));

    res.status(200).json({ actuators, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

exports.getAllWithoutPagination = async (req, res) => {
  try {

    const actuators = await Actuators.findAll({});

    res.status(200).json({ actuators });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}