const { ActivityPresetParam, ActuatorsActivity, OtherActivities, DayRoutine, PeopleRoutines, People, Activities, RoutineActivities, HousePresets, HouseRooms, Rooms, Actuators } = require('../models');
const { v4: uuidv4 } = require('uuid');

exports.register = async (req, res) => {
  const { activity, actuators, otherActivities, presetId, room, name } = req.body;
  const userId = req.users.id;
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
      userId,
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
          if(statusMap[field] == false){
            actuatorStatus[field] = "OFF";
            continue
          }
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

exports.getAll = async (req, res) => {
  try {
    const { page } = req.params;
    const userId = req.users.id;
    const limit = 6;
    const offset = (page - 1) * limit;

    const count = await ActivityPresetParam.count({ where: { userId } });

    const presetParamsData = await ActivityPresetParam.findAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    const presetParams = presetParamsData.map((param) => ({
      id: param.id,
      paramName: param.name,
      actuatorSpec: [],
      presetId: param.presetId,
      activityId: param.activityId,
      activityRoom: param.activityRoom,
      type: "activityPresetParam",
    }));

    res.status(200).json({ activitiesPresetParamRoutes: presetParams, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users.id;

    const activitiesPresetParam = await ActivityPresetParam.findOne({ where: { id, userId } });
    if (!activitiesPresetParam) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const routineActivitiesReference = await RoutineActivities.findOne({where: {activityPresetParam: id}})
    if(routineActivitiesReference){
      return res.status(423).json({ message: "Cannot delete: referenced elsewhere" });
    }

    await ActuatorsActivity.destroy({ where: { activityPresetParamId: id } });
    await OtherActivities.destroy({ where: { activityPresetParamId: id } });
    await activitiesPresetParam.destroy({ where: { id, userId } });
    res.status(200).json({ message: "Activity deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users.id;

    const activityPresetParam = await ActivityPresetParam.findOne({
      where: { id, userId }
    });

    if (!activityPresetParam) {
      return res.status(404).json({ error: 'Activity Preset Param not found' });
    }

    const actuatorsRaw = await ActuatorsActivity.findAll({
      where: { activityPresetParamId: id }
    });

    const actuatorIds = actuatorsRaw.map(a => a.actuatorId);
    const actuatorsInfo = await HouseRooms.findAll({
      where: { id: actuatorIds },
      include: [{
      model: Rooms,
      as: 'room'
      }]
    });

    const actuators = await Promise.all(actuatorsRaw.map(async (act) => {
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
      const status = statusFields
      .filter(field => act[field] !== undefined && act[field] !== null)
      .map(field => ({
        name: field,
        value: act[field] === "OFF" ? false : act[field]
      }));
      let actuator = await Actuators.findByPk(act.actuatorId);

      return {
      ...act.toJSON(),
      actuator,
      status
      };
    }));

    const otherActivitiesRaw = await OtherActivities.findAll({
      where: { activityPresetParamId: id }
    });

    const otherActivityIds = otherActivitiesRaw.map(item => item.activityId);
    const otherActivitiesDetails = await Activities.findAll({
      where: { id: otherActivityIds }
    });

    const activityMap = {};
    otherActivitiesDetails.forEach(act => {
      activityMap[act.id] = act;
    });

    const otherActivities = otherActivitiesRaw.map(item => {
      const activity = activityMap[item.activityId];
      return {
      otherActivity: activity ? activity.toJSON() : null,
      probability: item.probability
      };
    });
    // Get names
    const housePresets = await HousePresets.findByPk(activityPresetParam.presetId)
    const activity = await Activities.findByPk(activityPresetParam.activityId)

    res.status(200).json({
      id: activityPresetParam.id,
      name: activityPresetParam.name,
      presetId: activityPresetParam.presetId,
      presetName: housePresets.name,
      activityId: activityPresetParam.activityId,
      activity: activity,
      activityRoomId: activityPresetParam.activityRoom,
      actuators,
      otherActivities
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateById = async (req, res) => {
  const { id } = req.params;
  const { activity, actuators, otherActivities, presetId, room, name } = req.body;
  const userId = req.users.id;

  if (!activity || !name || !presetId || !room) {
    return res.status(400).json({ error: 'Insufficient data to update routine' });
  }

  const transaction = await ActivityPresetParam.sequelize.transaction();
  try {
    const activityPresetParam = await ActivityPresetParam.findOne({ where: { id, userId } });
    if (!activityPresetParam) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Activity Preset Param not found' });
    }

    await activityPresetParam.update({
      name,
      presetId,
      activityId: activity.id,
      activityRoom: room.id
    }, { transaction });

    await ActuatorsActivity.destroy({ where: { activityPresetParamId: id }, transaction });
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
          if (statusMap[field] == false) {
            actuatorStatus[field] = "OFF";
            continue;
          }
          actuatorStatus[field] = statusMap[field];
        }
      }
      await ActuatorsActivity.create({
        id: uuidv4(),
        activityPresetParamId: id,
        actuatorId,
        ...actuatorStatus
      }, { transaction });
    }

    await OtherActivities.destroy({ where: { activityPresetParamId: id }, transaction });
    for (const item of otherActivities) {
      await OtherActivities.create({
        id: uuidv4(),
        activityPresetParamId: id,
        activityId: item.otherActivity.id,
        probability: item.probability,
      }, { transaction });
    }

    await transaction.commit();
    return res.status(200).json({ message: 'Activity Preset param updated successfully!' });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    return res.status(500).json({ error: 'Error updating routine', details: err.message });
  }
};