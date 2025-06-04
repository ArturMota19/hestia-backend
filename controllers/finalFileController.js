const {
  DayRoutine,
  ActivityPresetParam,
  Activities,
  HouseRooms,
  ActuatorsActivity,
  Actuators,
  Rooms,
  RoomActuators,
  GraphRooms,
  RoutineActivities,
} = require("../models");

exports.generateFinalFile = async (req, res) => {
  try {
    const { presetId } = req.params;
    const finalData = [];
    console.log(presetId);

    // Step 1 - Get all actuators
    const actuators = await Actuators.findAll();
    if (!actuators) {
      throw new Error("No actuators found");
    }
    finalData.push({ actuators });
    // Step 2 - Get all rooms in this preset
    const houseRooms = await HouseRooms.findAll({
      where: { housePresetId: presetId },
      include: [
        {
          model: Rooms,
        },
        {
          model: RoomActuators,
          include: [
            {
              model: Actuators,
            },
          ],
        },
      ],
    });
    finalData.push({ rooms: houseRooms });

    // Step 3 - Get the graph (connections) between rooms in this preset
    const graphRooms = await GraphRooms.findAll({
      where: { housePresetId: presetId },
      include: [
        {
          model: HouseRooms,
          as: "originHouseRoom",
          include: [{ model: Rooms }],
        },
        {
          model: HouseRooms,
          as: "destinationHouseRoom",
          include: [{ model: Rooms }],
        },
      ],
    });
    finalData.push({ graph: graphRooms });

    // Step 4 - Get the activities
    // Get activities with their routineActivities
    // Get all RoutineActivities for this preset
    const routineActivities = await RoutineActivities.findAll({
      where: { presetId: presetId },
      include: [
      {
        model: ActivityPresetParam,
        as: "activityPresetParamAssociation",
        include: [
        {
          model: Activities,
          as: "activity",
        },
        {
          model: HouseRooms,
          as: "houserooms",
          include: [{ model: Rooms }],
        },
        {
          model: ActuatorsActivity,
          as: "actuatorsActivity",
          include: [
            {
              model: Actuators,
            },
          ],
        },
        ],
      },
      ],
    });
    const activities = routineActivities.map(routineActivity => ({
      ...routineActivity.toJSON(),
      activityPresetParam: routineActivity.activityPresetParam,
    }));

    finalData.push({ activities });

    res.status(200).json({ message: "OK", finalData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.checkFileValidation = async (req, res) => {
  try {
    res.status(201).json({ message: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
