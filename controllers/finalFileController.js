const PeopleRoutines = require("../models").PeopleRoutines;
const People = require("../models").People;

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
  OtherActivities,
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
        {
          model: OtherActivities,
          as: "otherActivities",
          include: [
            {
              model: Activities,
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

    // Step 5 - Add People routines and day activities
    const peopleRoutines = await PeopleRoutines.findAll({
      where: { housePresetId: presetId },
    });

    // For each person, get their day routines and activities
    const days = [];
    for (const pr of peopleRoutines) {
      const person = await People.findByPk(pr.peopleId, { attributes: ["name"] });
      const personDayRoutineIds = [
        pr.mondayRoutineId,
        pr.tuesdayRoutineId,
        pr.wednesdayRoutineId,
        pr.thursdayRoutineId,
        pr.fridayRoutineId,
        pr.saturdayRoutineId,
        pr.sundayRoutineId,
      ].filter(Boolean);

      // Adiciona o person ao objeto pr para ser usado depois
      pr.dataValues.person = person;

      // Get all DayRoutine objects for these IDs
      const dayRoutines = await DayRoutine.findAll({
      where: { id: personDayRoutineIds },
      });

      // Map dayRoutineId to day name
      const dayRoutineIdToDay = {};
      dayRoutines.forEach(dr => {
      dayRoutineIdToDay[dr.id] = dr.day;
      });

      // Get all RoutineActivities for these dayRoutineIds, ordered by startTime
      const dayActivities = await RoutineActivities.findAll({
      where: { dayRoutineId: personDayRoutineIds },
      order: [["startTime", "ASC"]],
      include: [
        {
        model: ActivityPresetParam,
        as: "activityPresetParamAssociation",
        include: [
          { model: Activities, as: "activity" },
          { model: HouseRooms, as: "houserooms", include: [{ model: Rooms }] },
          {
          model: ActuatorsActivity,
          as: "actuatorsActivity",
          include: [{ model: Actuators }],
          },
        ],
        },
      ],
      });

      // Group activities by day for this person
      const personDays = {};
      dayActivities.forEach(act => {
      const day = dayRoutineIdToDay[act.dayRoutineId];
      if (!personDays[day]) personDays[day] = [];
      personDays[day].push({
        ...act.toJSON(),
        activityPresetParam: act.activityPresetParam,
      });
      });

      days.push({
      person: pr, 
      days: personDays,
      });
    }

    finalData.push({ days });

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
