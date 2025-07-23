const { ActivityPresetParam, OtherActivities } = require("../models");
const Activities = require("../models/Activities")
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  try {
    const { name, errorValue, color } = req.body;
    const userId = req.users.id;

    const activitie = await Activities.create({
      name,
      errorValue,
      color,
      userId,
    });
    res.status(201).json({ message: "Activitie registered", activitie });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page } = req.params;
    const userId = req.users.id;
    const limit = 6;
    const offset = (page - 1) * limit;

    const count = await Activities.count({ where: { userId } });

    const activitieData = await Activities.findAll({
      where: { userId },
      limit,
      offset,
    });

    const activity = activitieData.map((activityEach) => ({
      id: activityEach.id,
      paramName: activityEach.name,
      actuatorSpec: [],
      capacity: null,
      type: "activity",
    }));

    res.status(200).json({ activities: activity, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getByFilter = async (req, res) => {
  try {
    const userId = req.users.id;
    const {nameFilter} = req.params;
    const where = {
      userId,
      ...(nameFilter && { name: { [Op.like]: `%${nameFilter}%` } }),
    };

    const activitiesData = await Activities.findAll({ where });
    const activities = activitiesData.map((activityEach) => ({
      id: activityEach.id,
      paramName: activityEach.name,
      actuatorSpec: [],
      capacity: null,
      type: "activity",
    }));

    res.status(200).json({ activities });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


exports.getAllWithoutPage = async (req, res) => {
  try {
    const userId = req.users.id;

    const activitieData = await Activities.findAll({
      where: { userId },
    });

    res.status(200).json({ activitieData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users.id;

    const activity = await Activities.findOne({ where: { id, userId } });
    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    const hasReference = await ActivityPresetParam.findOne({where: {activityId: id}})
    const otherActivitiesReference = await OtherActivities.findOne({where: {activityId: id}})
    if(hasReference || otherActivitiesReference){
      return res.status(423).json({ message: "Cannot delete: referenced elsewhere" });
    }

    await Activities.destroy({ where: { id, userId } });
    res.status(200).json({ message: "Activity deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};