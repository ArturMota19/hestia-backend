const express = require('express');
const authRoutes = require('./routes/authRoutes');
const peopleRoutes = require('./routes/peopleRoutes')
const activitiesRoutes = require('./routes/activitiesRoutes')
const roomsRoutes = require('./routes/roomsRoutes')
const actuatorsRoutes = require('./routes/actuatorsRoutes')
const presetsRoutes = require('./routes/presetsRoutes')
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs')
const Actuators = require('./models/Actuators');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  credentials: true, 
}));

app.use('/auth', authRoutes);
app.use('/people', peopleRoutes)
app.use('/activities', activitiesRoutes)
app.use('/rooms', roomsRoutes)
app.use('/actuators', actuatorsRoutes)
app.use('/presets', presetsRoutes)

const PORT = process.env.PORT || 3000;
sequelize.sync({ alter: true })
  .then(async () => {
    console.log('Database synchronized.');

    const existingUser = await User.findOne({ where: { isAdmin: true } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await User.create({
        name: process.env.ADMIN_NAME || 'Admin',
        email: process.env.ADMIN_EMAIL || 'admin@example.com',
        password: hashedPassword,
        isAdmin: true,
        isSearcherUFBA: true
      });
      console.log('Default admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    // Create default actuators

    const defaultActuators = [
      { name: 'LAMPADA', hasSwitch: true,  hasBrightValue: true, hasTempValue: false, hasSoundVolume: false, hasTempSet: false, hasMode: false, hasHumanMotionState: false },
      { name: 'CAFETEIRA', hasSwitch: true,  hasBrightValue: false, hasTempValue: false, hasSoundVolume: false, hasTempSet: false, hasMode: false, hasHumanMotionState: false },
      { name: 'PLUG', hasSwitch: true,  hasBrightValue: false, hasTempValue: false, hasSoundVolume: false, hasTempSet: false, hasMode: false, hasHumanMotionState: false },
      { name: 'SOM', hasSwitch: true,  hasBrightValue: false, hasTempValue: false, hasSoundVolume: true, hasTempSet: false, hasMode: false, hasHumanMotionState: false },
      { name: 'AR_CONDICIONADO', hasSwitch: true,  hasBrightValue: false, hasTempValue: true, hasSoundVolume: false, hasTempSet: true, hasMode: true, hasHumanMotionState: false },
      { name: 'TV', hasSwitch: true,  hasBrightValue: false, hasTempValue: false, hasSoundVolume: true, hasTempSet: false, hasMode: true, hasHumanMotionState: false },
      { name: 'SENSOR_PRESENCA', hasSwitch: true,  hasBrightValue: false, hasTempValue: false, hasSoundVolume: false, hasTempSet: false, hasMode: false, hasHumanMotionState: true },
    ];

    for (const actuator of defaultActuators) {
      const existingActuator = await Actuators.findOne({ where: { name: actuator.name } });
      if (!existingActuator) {
        await Actuators.create(actuator);
        console.log(`Default actuator ${actuator.name} created.`);
      } else {
        console.log(`Actuator ${actuator.name} already exists.`);
      }
    }


  })
  .catch(err => console.error('Error synchronizing database:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));