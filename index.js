const express = require("express");
const authRoutes = require("./routes/authRoutes");
const peopleRoutes = require("./routes/peopleRoutes");
const activitiesRoutes = require("./routes/activitiesRoutes");
const roomsRoutes = require("./routes/roomsRoutes");
const actuatorsRoutes = require("./routes/actuatorsRoutes");
const presetsRoutes = require("./routes/presetsRoutes");
const routinesRoutes = require("./routes/routinesRoutes")
const cors = require("cors");
const { sequelize, models } = require("./models/index.js");
const Users = require("./models/Users");
const bcrypt = require("bcryptjs");
const Actuators = require("./models/Actuators");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/auth", authRoutes);
app.use("/people", peopleRoutes);
app.use("/activities", activitiesRoutes);
app.use("/rooms", roomsRoutes);
app.use("/actuators", actuatorsRoutes);
app.use("/presets", presetsRoutes);
app.use("/routines", routinesRoutes)

const PORT = process.env.PORT || 3000;
sequelize
  .sync({ alter: false })
  .then(async () => {
    const existingUser = await Users.findOne({ where: { isAdmin: true } });

    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      await Users.create({
        name: process.env.ADMIN_NAME || "Admin",
        email: process.env.ADMIN_EMAIL || "admin@example.com",
        password: hashedPassword,
        isAdmin: true,
        isSearcherUFBA: true,
      });
      console.log("Default admin users created.");
    } else {
      console.log("Admin users already exists.");
    }

    // Create default actuators

    const defaultActuators = [
      {
        name: "LAMPADA",
        hasSwitch: true,
        hasBrightValue: true,
        hasTempValue: false,
        hasSoundVolume: false,
        hasTempSet: false,
        hasMode: false,
        hasHumanMotionState: false,
      },
      {
        name: "CAFETEIRA",
        hasSwitch: true,
        hasBrightValue: false,
        hasTempValue: false,
        hasSoundVolume: false,
        hasTempSet: false,
        hasMode: false,
        hasHumanMotionState: false,
      },
      {
        name: "PLUG",
        hasSwitch: true,
        hasBrightValue: false,
        hasTempValue: false,
        hasSoundVolume: false,
        hasTempSet: false,
        hasMode: false,
        hasHumanMotionState: false,
      },
      {
        name: "SOM",
        hasSwitch: true,
        hasBrightValue: false,
        hasTempValue: false,
        hasSoundVolume: true,
        hasTempSet: false,
        hasMode: false,
        hasHumanMotionState: false,
      },
      {
        name: "AR_CONDICIONADO",
        hasSwitch: true,
        hasBrightValue: false,
        hasTempValue: true,
        hasSoundVolume: false,
        hasTempSet: true,
        hasMode: true,
        hasHumanMotionState: false,
      },
      {
        name: "TV",
        hasSwitch: true,
        hasBrightValue: false,
        hasTempValue: false,
        hasSoundVolume: true,
        hasTempSet: false,
        hasMode: true,
        hasHumanMotionState: false,
      },
      {
        name: "SENSOR_PRESENCA",
        hasSwitch: true,
        hasBrightValue: false,
        hasTempValue: false,
        hasSoundVolume: false,
        hasTempSet: false,
        hasMode: false,
        hasHumanMotionState: true,
      },
    ];

    for (const actuator of defaultActuators) {
      const existingActuator = await Actuators.findOne({
        where: { name: actuator.name },
      });
      if (!existingActuator) {
        await Actuators.create(actuator);
        console.log(`Default actuator ${actuator.name} created.`);
      } else {
        console.log(`Actuator ${actuator.name} already exists.`);
      }
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Error synchronizing database:", err));


