const { RoutineActivities, ActuatorsActivity, OtherActivities } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  const { activity, actuators, otherActivities, start, duration, dayRoutineId, presetId } = req.body;
  // PRECISO CRIAR OS DAY ROUTINES ASSIM QUE ADICIONO A PESSOA
  // PRECISO ASSOCIAR O PRESET ID TB
  if (!activity || !start || !duration || !dayRoutineId || !presetId) {
    return res.status(400).json({ error: 'Insufficient data to register routine' });
  }

  const transaction = await RoutineActivities.sequelize.transaction();

  try {
    const startTime = `${String(start).padStart(2, '0')}:00:00`;
    const endTime = `${String(start + duration).padStart(2, '0')}:00:00`;

    // 1. Create main RoutineActivity
    const routineActivity = await RoutineActivities.create({
      id: uuidv4(),
      dayRoutineId,
      activityId: activity.id,
      startTime,
      endTime,
      activityRoom: activity.houseRoomId || activity.roomId, // depends on source
    }, { transaction });

    // 2. Register associated Actuators
    for (const item of actuators) {
      const actuatorId = item.actuatorId;
      for (const status of item.status) {
        await ActuatorsActivity.create({
          id: uuidv4(),
          routineActivitiesId: routineActivity.id,
          actuatorId,
          switch_led: status.switch_led,
          bright_value_v2: status.bright_value_v2,
          temp_value_v2: status.temp_value_v2,
          switch: status.switch,
          switch_1: status.switch_1,
          sound_volume: status.sound_volume,
          temp_set: status.temp_set,
          mode: status.mode,
          presence_state: status.presence_state,
          human_motion_state: status.human_motion_state,
        }, { transaction });
      }
    }

    // 3. Register associated OtherActivities
    for (const item of otherActivities) {
      await OtherActivities.create({
        id: uuidv4(),
        routineActivitiesId: routineActivity.id,
        activityId: item.otherActivity.id,
        probability: item.probability,
      }, { transaction });
    }

    await transaction.commit();
    return res.status(201).json({ message: 'Routine registered successfully!' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Error registering routine', details: err.message });
  }
};
