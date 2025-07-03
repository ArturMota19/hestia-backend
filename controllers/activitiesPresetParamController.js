const { ActivityPresetParam, ActuatorsActivity, OtherActivities, DayRoutine, PeopleRoutines, People, Activities, RoutineActivities } = require('../models');
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