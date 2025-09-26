const { PeopleRoutines, People, Actuators, Rooms } = require("../models");
const PeoplePriority = require("../models/PeoplePriority");

exports.register = async (req, res) => {
  try {
    const { peopleRoutinesId, presetId, priority, preferences } = req.body;
    const existing = await PeopleRoutines.findOne({
      where: {
        housePresetId: presetId,
        priority,
      }
    });
    if (existing) {
      return res.status(400).json({ error: "There is already a routine with this preset and priority for this user." });
    }
    await PeopleRoutines.update(
      { priority },
      { where: { id: peopleRoutinesId } }
    );
    if(!preferences){
      res.status(201).json({ message: "OK without preferences, only priority.", priority });
    }
    const prioritiesToCreate = preferences.map((pref) => {
      const { actuator, status, room } = pref;

      const baseData = {
        peopleRoutinesId,
        roomId: room.roomId,
        actuatorId: actuator.actuatorId,
      };

      status.forEach(({ name, value }) => {
        if (["switch", "switch_led", "switch_1", "presence_state", "human_motion_state"].includes(name)) {
          baseData[name] = value ? "ON" : "OFF";
        } else {
          baseData[name] = value;
        }
      });

      return baseData;
    });

    await PeoplePriority.bulkCreate(prioritiesToCreate);

    res.status(201).json({ message: "OK", priority });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getByPresetId = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id){
      throw new Error("No preset id");
    }
    const routines = await PeopleRoutines.findAll({where: {housePresetId: id}})
    if(!routines){
      res.status(200).json({ message: "No preferences registered" });
    }
    let peopleRoutinesIds = []
    peopleRoutinesIds = routines.map(routine => ({
      id: routine.id,
      peopleId: routine.peopleId
    }));
    const allRoutines = []

    for(const routineId of peopleRoutinesIds){
      const eachPreference = await PeoplePriority.findAll({where: {peopleRoutinesId: routineId.id}})
      for (let i = 0; i < eachPreference.length; i++) {
        const actuator = await Actuators.findOne({ where: { id: eachPreference[i].actuatorId } });
        eachPreference[i].dataValues.actuatorName = actuator ? actuator.name : null;
        const room = await Rooms.findOne({where: {id: eachPreference[i].roomId}})
        eachPreference[i].dataValues.roomName = room ? room.name : null
      }
      const people = await People.findOne({where: {id: routineId.peopleId}})
      const priority = await PeopleRoutines.findOne({where: {id: routineId.id}})
      const newJson = {peopleId: routineId.peopleId, peopleName: people.name, eachPreference, priority: priority.priority}
      allRoutines.push(newJson)
    }

    res.status(200).json({ preferences: allRoutines });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};