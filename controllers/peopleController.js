const { PeopleRoutines } = require("../models");
const People = require("../models/People")
const { Op } = require("sequelize");

exports.register = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.users.id;

    const people = await People.create({ name, userId });
    res.status(201).json({ message: "People registered", people });
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

    const count = await People.count({ where: { userId } });

    const peopleData = await People.findAll({
      where: { userId },
      limit,
      offset,
    });

    const people = peopleData.map((person) => ({
      id: person.id,
      paramName: person.name,
      actuatorSpec: [],
      capacity: null,
      type: "person",
    }));

    res.status(200).json({ people, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllWithoutPage = async (req, res) => {
  try {
    const userId = req.users.id;

    const peopleData = await People.findAll({
      where: { userId },
    });

    res.status(200).json({ peopleData });
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

    const peopleData = await People.findAll({ where });
    const people = peopleData.map((person) => ({
      id: person.id,
      paramName: person.name,
      actuatorSpec: [],
      capacity: null,
      type: "person",
    }));

    res.status(200).json({ people});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users.id;

    const person = await People.findOne({ where: { id, userId } });
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const hasReference = await PeopleRoutines.findOne({where: {peopleId: id}})
    if(hasReference){
      return res.status(423).json({ message: "Cannot delete: referenced elsewhere" });
    }

    await People.destroy({ where: { id, userId } });
    res.status(200).json({ message: "Person deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};