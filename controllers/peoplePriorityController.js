const { PeopleRoutines } = require("../models");
const PeoplePriority = require("../models/PeoplePriority");

exports.register = async (req, res) => {
  try {
    const { peopleRoutinesId, priority, preferences } = req.body;
    const userId = req.users.id;

    // Atualiza a prioridade da rotina
    await PeopleRoutines.update(
      { priority },
      { where: { id: peopleRoutinesId } }
    );

    // Itera sobre todas as preferências recebidas
    const prioritiesToCreate = preferences.map((pref) => {
      const { actuator, status, room } = pref;

      const baseData = {
        peopleRoutinesId,
        roomId: room.roomId,
        actuatorId: actuator.actuatorId,
      };

      // Mapeia dinamicamente os campos de status
      status.forEach(({ name, value }) => {
        if (["switch", "switch_led", "switch_1", "presence_state", "human_motion_state"].includes(name)) {
          baseData[name] = value ? "ON" : "OFF";
        } else {
          baseData[name] = value;
        }
      });

      return baseData;
    });

    // Cria todos os registros de uma vez
    await PeoplePriority.bulkCreate(prioritiesToCreate);

    res.status(201).json({ message: "OK" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
