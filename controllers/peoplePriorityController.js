const { PeopleRoutines } = require("../models");
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
