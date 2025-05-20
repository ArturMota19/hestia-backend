const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DayRoutine = sequelize.define('dayroutine', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  day: {
    type: DataTypes.ENUM(
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday'
    ),
    allowNull: false,
  },
});

DayRoutine.associate = (models) => {
  // Each DayRoutine can be referenced by many PeopleRoutines as a specific day's routine
  DayRoutine.hasMany(models.PeopleRoutines, {
    foreignKey: 'mondayRoutineId',
    as: 'mondayPeopleRoutines',
  });
  DayRoutine.hasMany(models.PeopleRoutines, {
    foreignKey: 'tuesdayRoutineId',
    as: 'tuesdayPeopleRoutines',
  });
  DayRoutine.hasMany(models.PeopleRoutines, {
    foreignKey: 'wednesdayRoutineId',
    as: 'wednesdayPeopleRoutines',
  });
  DayRoutine.hasMany(models.PeopleRoutines, {
    foreignKey: 'thursdayRoutineId',
    as: 'thursdayPeopleRoutines',
  });
  DayRoutine.hasMany(models.PeopleRoutines, {
    foreignKey: 'fridayRoutineId',
    as: 'fridayPeopleRoutines',
  });
  DayRoutine.hasMany(models.PeopleRoutines, {
    foreignKey: 'saturdayRoutineId',
    as: 'saturdayPeopleRoutines',
  });
  DayRoutine.hasMany(models.PeopleRoutines, {
    foreignKey: 'sundayRoutineId',
    as: 'sundayPeopleRoutines',
  });
};


module.exports = DayRoutine;
