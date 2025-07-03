const { ActivityPresetParam, ActuatorsActivity, OtherActivities, DayRoutine, PeopleRoutines, People, Activities } = require('../models');
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