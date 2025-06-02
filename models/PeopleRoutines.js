const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PeopleRoutines = sequelize.define('peopleroutines', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  housePresetId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'housepresets',
      key: 'id',
    },
  },
  peopleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'people',
      key: 'id',
    },
  },
  mondayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutines',
      key: 'id',
    },
  },
  tuesdayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutines',
      key: 'id',
    },
  },
  wednesdayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutines',
      key: 'id',
    },
  },
  thursdayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutines',
      key: 'id',
    },
  },
  fridayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutines',
      key: 'id',
    },
  },
  saturdayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutines',
      key: 'id',
    },
  },
  sundayRoutineId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'dayroutines',
      key: 'id',
    },
  },
  
});

PeopleRoutines.associate = (models) => {
  PeopleRoutines.belongsTo(models.People, {
    foreignKey: 'peopleId',
    as: 'person',
  });
  PeopleRoutines.belongsTo(models.HousePresets, {
    foreignKey: 'housePresetId',
  });
  PeopleRoutines.belongsTo(models.DayRoutine, {
    foreignKey: 'mondayRoutineId',
    as: 'mondayRoutine',
  });
  PeopleRoutines.belongsTo(models.DayRoutine, {
    foreignKey: 'tuesdayRoutineId',
    as: 'tuesdayRoutine',
  });
  PeopleRoutines.belongsTo(models.DayRoutine, {
    foreignKey: 'wednesdayRoutineId',
    as: 'wednesdayRoutine',
  });
  PeopleRoutines.belongsTo(models.DayRoutine, {
    foreignKey: 'thursdayRoutineId',
    as: 'thursdayRoutine',
  });
  PeopleRoutines.belongsTo(models.DayRoutine, {
    foreignKey: 'fridayRoutineId',
    as: 'fridayRoutine',
  });
  PeopleRoutines.belongsTo(models.DayRoutine, {
    foreignKey: 'saturdayRoutineId',
    as: 'saturdayRoutine',
  });
  PeopleRoutines.belongsTo(models.DayRoutine, {
    foreignKey: 'sundayRoutineId',
    as: 'sundayRoutine',
  });
};


module.exports = PeopleRoutines;
