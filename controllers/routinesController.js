const { RoutineActivities, ActuatorsActivity, OtherActivities, DayRoutine, PeopleRoutines, People, Activities } = require('../models');
const { v4: uuidv4 } = require('uuid');
const ActivityPresetParam = require('../models/ActivityPresetParam');

function formatTime(blocks) {
  const totalMinutes = blocks * 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

function deformatTime(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  return Math.floor(totalMinutes / 30);
}

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

exports.registerActivyPresetParam = async (req, res) => {
  const { activity, actuators, otherActivities, presetId, room, name } = req.body;
    if (!activity || !name || !presetId || !room) {
    return res.status(400).json({ error: 'Insufficient data to register routine' });
    }

    const transaction = await ActivityPresetParam.sequelize.transaction();
    try {

    const activityPresetParam = await ActivityPresetParam.create({
      id: uuidv4(),
      name: name,
      presetId: presetId,
      activityId: activity.id,
      activityRoom: room.id,
    }, { transaction });

    for (const item of actuators) {
      const actuatorId = item.actuator.actuatorId;

      const statusMap = Object.fromEntries(item.status.map(({ name, value }) => [name, value]));

      const statusFields = [
        'switch_led',
        'bright_value_v2',
        'temp_value_v2',
        'switch',
        'switch_1',
        'sound_volume',
        'temp_set',
        'mode',
        'presence_state',
        'human_motion_state'
      ];

      const actuatorStatus = {};
      for (const field of statusFields) {
        if (statusMap[field] !== undefined) {
          actuatorStatus[field] = statusMap[field];
        }
      }

      await ActuatorsActivity.create({
        id: uuidv4(),
        activityPresetParamId: activityPresetParam.id,
        actuatorId,
        ...actuatorStatus
      }, { transaction });
    }

    for (const item of otherActivities) {
      await OtherActivities.create({
        id: uuidv4(),
        activityPresetParamId: activityPresetParam.id,
        activityId: item.otherActivity.id,
        probability: item.probability,
      }, { transaction });
    }

    await transaction.commit();
    return res.status(201).json({ message: 'Activity Preset param registered successfully!' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Error registering routine', details: err.message });
  }
}

exports.getActivityPresetParams = async (req, res) => {
  try {
    const { presetId } = req.params;
    if (!presetId) {
      return res.status(400).json({ error: 'presetId is required' });
    }

    const presets = await ActivityPresetParam.findAll({
      where: { presetId }
    });

    const result = await Promise.all(
      presets.map(async (preset) => {
        const actuators = await ActuatorsActivity.findAll({
          where: { activityPresetParamId: preset.id }
        });

        const otherActivities = await OtherActivities.findAll({
          where: { activityPresetParamId: preset.id }
        });

        return {
          ...preset.toJSON(),
          actuators,
          otherActivities
        };
      })
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching activity preset params', details: err.message });
  }
};


exports.registerEachRoutineActivity = async (req, res) => {
  const { activityPresetParam, dayRoutineId, start, duration} = req.body;
  //return
  if (!activityPresetParam || !duration || !dayRoutineId) {
    return res.status(400).json({ error: 'Insufficient data to register routine' });
  }


  try {
    const startTime = formatTime(start);
    const endTime = formatTime(start + duration);

    const routineActivities = await RoutineActivities.create({
      id: uuidv4(),
      activityPresetParam,
      startTime,
      endTime,
      dayRoutineId
    })


    return res.status(201).json({ message: 'Routine registered successfully!', data: routineActivities});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error registering routine', details: err.message });
  }
};

exports.getRoutine = async (req,res) => {
    try {
    const { dayRoutineId } = req.params;
    if (!dayRoutineId) {
      return res.status(400).json({ error: 'dayRoutineId is required' });
    }

    const data = await RoutineActivities.findAll({
      where: { dayRoutineId }
    });

    const activitiesWithName = await Promise.all(
      data.map(async (activitieRoutine) => {
        const activityPresetParam = await ActivityPresetParam.findOne({ where: { id: activitieRoutine.activityPresetParam } });
        const activity = await Activities.findOne({where: {id: activityPresetParam.activityId}})
        const startTime = deformatTime(activitieRoutine.startTime)
        const endTime = deformatTime(activitieRoutine.endTime)
        return {
          ...activitieRoutine.toJSON(),
          start: startTime,
          end: endTime,
          duration: endTime - startTime,
          title: activityPresetParam.name,
          color: activity.color
        };
      })
    );

    return res.status(200).json(activitiesWithName);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching people activity routine', details: err.message });
  }
}

exports.getAllRoutinesDays = async (req, res) => {
  try {
    let { peopleRoutinesIds } = req.body;
    if (!peopleRoutinesIds || !Array.isArray(peopleRoutinesIds) || peopleRoutinesIds.length === 0) {
      return res.status(400).json({ error: 'peopleRoutinesIds (array) is required in body' });
    }

    // Busca todas as rotinas das pessoas de uma vez
    const peopleRoutines = await PeopleRoutines.findAll({ where: { id: peopleRoutinesIds } });
    if (!peopleRoutines || peopleRoutines.length === 0) {
      return res.status(404).json({ error: 'No PeopleRoutines found for provided ids' });
    }

    // Busca nomes das pessoas
    const peopleIds = peopleRoutines.map(r => r.peopleId);
    const peopleList = await People.findAll({ where: { id: peopleIds } });
    const peopleMap = {};
    peopleList.forEach(p => { peopleMap[p.id] = p.name; });

    const days = [
      { key: 'mondayRoutineId', name: 'monday' },
      { key: 'tuesdayRoutineId', name: 'tuesday' },
      { key: 'wednesdayRoutineId', name: 'wednesday' },
      { key: 'thursdayRoutineId', name: 'thursday' },
      { key: 'fridayRoutineId', name: 'friday' },
      { key: 'saturdayRoutineId', name: 'saturday' },
      { key: 'sundayRoutineId', name: 'sunday' }
    ];

    const result = await Promise.all(
      peopleRoutines.map(async (peopleRoutine) => {
        const obj = {
          peopleRoutineId: peopleRoutine.id,
          peopleId: peopleRoutine.peopleId,
          peopleName: peopleMap[peopleRoutine.peopleId] || null
        };

        for (const day of days) {
          const dayRoutineId = peopleRoutine[day.key];
          let routine = [];
          if (dayRoutineId) {
            const data = await RoutineActivities.findAll({ where: { dayRoutineId } });
            routine = await Promise.all(
              data.map(async (activitieRoutine) => {
                const activityPresetParam = await ActivityPresetParam.findOne({ where: { id: activitieRoutine.activityPresetParam } });
                const activity = await Activities.findOne({where: {id: activityPresetParam.activityId}})
                const startTime = deformatTime(activitieRoutine.startTime)
                const endTime = deformatTime(activitieRoutine.endTime)
                return {
                  ...activitieRoutine.toJSON(),
                  start: startTime,
                  end: endTime,
                  duration: endTime - startTime,
                  title: activityPresetParam.name,
                  color: activity.color
                };
              })
            );
          }
          obj[day.name] = {
            dayName: day.name,
            dayId: dayRoutineId,
            routine
          };
        }
        return obj;
      })
    );

    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ error: 'Error fetching all routines days', details: err.message });
  }
}

exports.updateRoutineActivities = async (req, res) => {
  try {
    const activities = req.body;
    if (!Array.isArray(activities) || activities.length === 0) {
      return res.status(400).json({ error: 'Array of activities is required' });
    }

    const updatedActivities = [];

    for (const activity of activities) {
      const { id, activityPresetParam, start, duration, dayRoutineId } = activity;
      if (!id || !activityPresetParam || start === undefined || duration === undefined || !dayRoutineId) {
        return res.status(400).json({ error: 'Missing required fields in activity object' });
      }

      const startTime = formatTime(start);
      const endTime = formatTime(duration + start);
      const [updatedCount] = await RoutineActivities.update(
        {
          activityPresetParam,
          startTime,
          endTime,
          dayRoutineId
        },
        {
          where: { id }
        }
      );

      if (updatedCount === 0) {
        return res.status(404).json({ error: `RoutineActivity with id ${id} not found` });
      }

      // Fetch the updated activity
      const updatedActivity = await RoutineActivities.findOne({ where: { id } });
      updatedActivities.push(updatedActivity);
    }

    return res.status(200).json({ message: 'Activities updated successfully', updatedActivities });
  } catch (err) {
    return res.status(500).json({ error: 'Error updating activities', details: err.message });
  }
}

exports.deleteActivity = async (req,res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: 'RoutineActivity id is required' });
  }

  const transaction = await RoutineActivities.sequelize.transaction();

  try {
    // Delete related ActuatorsActivity and OtherActivities first
    await ActuatorsActivity.destroy({ where: { routineActivitiesId: id }, transaction });
    await OtherActivities.destroy({ where: { routineActivitiesId: id }, transaction });

    // Delete the RoutineActivity itself
    const deletedCount = await RoutineActivities.destroy({ where: { id }, transaction });

    if (deletedCount === 0) {
      await transaction.rollback();
      return res.status(404).json({ error: 'RoutineActivity not found' });
    }

    await transaction.commit();
    return res.status(200).json({ message: 'RoutineActivity deleted successfully' });
  } catch (err) {
    await transaction.rollback();
    return res.status(500).json({ error: 'Error deleting RoutineActivity', details: err.message });
  }
}

exports.deletePersonFromPreset = async (req,res) => {
  try {
    const { personId, housePresetId } = req.body;
    if (!personId || !housePresetId) {
      return res.status(400).json({ error: "personId and housePresetId are required" });
    }

    // Find the PeopleRoutine
    const peopleRoutine = await PeopleRoutines.findOne({
      where: {
        peopleId: personId,
        housePresetId: housePresetId
      }
    });

    if (!peopleRoutine) {
      return res.status(404).json({ error: "PeopleRoutine not found for this person and housePreset" });
    }

    // Get all DayRoutine IDs
    const dayRoutineIds = [
      peopleRoutine.mondayRoutineId,
      peopleRoutine.tuesdayRoutineId,
      peopleRoutine.wednesdayRoutineId,
      peopleRoutine.thursdayRoutineId,
      peopleRoutine.fridayRoutineId,
      peopleRoutine.saturdayRoutineId,
      peopleRoutine.sundayRoutineId
    ];

    // Delete all RoutineActivities, ActuatorsActivity, and OtherActivities for each DayRoutine
    for (const dayRoutineId of dayRoutineIds) {
      const routineActivities = await RoutineActivities.findAll({ where: { dayRoutineId } });
      for (const routineActivity of routineActivities) {
        await ActuatorsActivity.destroy({ where: { routineActivitiesId: routineActivity.id } });
        await OtherActivities.destroy({ where: { routineActivitiesId: routineActivity.id } });
      }
      await RoutineActivities.destroy({ where: { dayRoutineId } });
      await DayRoutine.destroy({ where: { id: dayRoutineId } });
    }

    // Delete the PeopleRoutine itself
    await PeopleRoutines.destroy({ where: { id: peopleRoutine.id } });

    return res.status(200).json({ message: "Person and their routines removed from preset successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting person from preset", details: err.message });
  }
}