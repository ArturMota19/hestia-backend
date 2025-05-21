const { RoutineActivities, ActuatorsActivity, OtherActivities, DayRoutine, PeopleRoutines, People } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.registerPeopleDayRoutines = async (req, res) => {
  const {personId, housePresetId} = req.body
  if(!personId){
    return res.status(400).json({error: "PersonId or housePresetId is missing"})
  }
  const existingRoutine = await PeopleRoutines.findOne({
    where: {
      peopleId: personId,
      housePresetId: housePresetId
    }
  });
  if (existingRoutine) {
    return res.status(409).json({ error: "Routine for this person and housePreset already exists" });
  }

  try{
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const peopleName = await People.findOne({
      where: {id: personId}
    })
    const eachDay = [];
    for (const day of days) {
      let returnDayRoutine = await DayRoutine.create({ day });
      eachDay.push(returnDayRoutine.id);
    }

    const data = await PeopleRoutines.create({
      peopleId: personId,
      housePresetId: housePresetId,
      mondayRoutineId: eachDay[0],
      tuesdayRoutineId: eachDay[1],
      wednesdayRoutineId: eachDay[2],
      thursdayRoutineId: eachDay[3],
      fridayRoutineId: eachDay[4],
      saturdayRoutineId: eachDay[5],
      sundayRoutineId: eachDay[6]
    });

    let peopleRoutines = {
      ...data.toJSON(),
      peopleName: peopleName ? peopleName.name : null
    };

    return res.status(201).json({ 
      message: 'Day routines registered for person.',  
      peopleRoutines
    });  
  }catch(e){
    return res.status(500).json({ error: 'Error registering people routine', details: err.message });
  }
}

exports.getPeopleRoutinesByPresetId = async (req, res) => {
  try {
    const { housePresetId } = req.params;
    if (!housePresetId) {
      return res.status(400).json({ error: 'housePresetId is required' });
    }

    const data = await PeopleRoutines.findAll({
      where: { housePresetId }
    });

    // Para cada rotina, buscar o nome da pessoa e adicionar ao objeto
    const routinesWithPeopleName = await Promise.all(
      data.map(async (routine) => {
        const people = await People.findOne({ where: { id: routine.peopleId } });
        return {
          ...routine.toJSON(),
          peopleName: people ? people.name : null
        };
      })
    );

    return res.status(200).json(routinesWithPeopleName);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching people routines', details: err.message });
  }
}

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
