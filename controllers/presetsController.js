const HousePresets = require("../models/HousePresets")
const RoomActuators = require("../models/RoomActuators")
const HouseRooms = require("../models/HouseRooms")
const GraphRooms = require("../models/GraphRooms");
const Actuators = require("../models/Actuators")
const ActivityPresetParam = require("../models/ActivityPresetParam")
const RoutineActivities = require("../models/RoutineActivities");
const PeopleRoutines = require("../models/PeopleRoutines")
const sequelize = require("../config/db");
const Rooms = require("../models/Rooms")

exports.register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, rooms, graphRooms } = req.body;
    const userId = req.users.id;

    const housePreset = await HousePresets.create(
      { userId, name },
      { transaction }
    );

    for (const room of rooms) {
      if (!room?.roomName?.id) {
        throw new Error(`Room ID missing in: ${JSON.stringify(room)}`);
      }

      const houseRoom = await HouseRooms.create(
        {
          housePresetId: housePreset.id,
          roomId: room.roomName.id,
        },
        { transaction }
      );

      for (const actuator of room.atuators || []) {
        if (!actuator?.id) {
          throw new Error(
            `Actuator ID missing in: ${JSON.stringify(actuator)}`
          );
        }
        // all the props of the actuators will be defined in routine
        await RoomActuators.create(
          {
            houseRoomId: houseRoom.id,
            actuatorId: actuator.id,
            name: actuator.name,
          },
          { transaction }
        );
      }
    }

    // Create room connections (graph)
    for (const graph of graphRooms) {
      if (!graph?.room1?.id || !graph?.room2?.id) {
        throw new Error(`Connection IDs missing in: ${JSON.stringify(graph)}`);
      }

      const originHouseRoom = await HouseRooms.findOne({
        where: {
          housePresetId: housePreset.id,
          roomId: graph.room1.id,
        },
        transaction,
      });

      const destinationHouseRoom = await HouseRooms.findOne({
        where: {
          housePresetId: housePreset.id,
          roomId: graph.room2.id,
        },
        transaction,
      });

      if (!originHouseRoom || !destinationHouseRoom) {
        throw new Error(
          `HouseRoom not found for one of the rooms in: ${JSON.stringify(
            graph
          )}`
        );
      }

      await GraphRooms.create(
        {
          housePresetId: housePreset.id,
          originRoomId: originHouseRoom.id,
          destinationRoomId: destinationHouseRoom.id,
          distance: graph.distance,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return res
      .status(201)
      .json({ message: "Preset created successfully!", housePreset });
  } catch (err) {
    await transaction.rollback();
    console.error("Error registering preset:", err);
    return res
      .status(500)
      .json({ error: "Error creating preset: " + err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page } = req.params;
    const userId = req.users.id;
    const limit = 6;
    const offset = (page - 1) * limit;

    const count = await HousePresets.count({ where: { userId } });

    const presetData = await HousePresets.findAll({
      where: { userId },
      limit,
      offset,
      include: [
        {
          model: GraphRooms,
          attributes: [
            "id",
            "housePresetId",
            "originRoomId",
            "destinationRoomId",
            "distance",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: HouseRooms,
              as: "originHouseRoom",
              include: [
                {
                  model: Rooms,
                },
              ],
            },
            {
              model: HouseRooms,
              as: "destinationHouseRoom",
              include: [
                {
                  model: Rooms,
                },
              ],
            },
          ],
        },
        {
          model: HouseRooms,
          include: [
            {
              model: Rooms,
            },
            {
              model: RoomActuators,
              attributes: [
                "id",
                "houseRoomId",
                "actuatorId",
                "name",
                "createdAt",
                "updatedAt",
              ],
              include: [
                {
                  model: Actuators,
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json({ presetData, count });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllWithoutPage = async (req, res) => {
  try {
    const userId = req.users.id;

    const presetDataRaw = await HousePresets.findAll({
      where: { userId },
      include: [
        {
          model: GraphRooms,
          attributes: [
            "id",
            "housePresetId",
            "originRoomId",
            "destinationRoomId",
            "distance",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: HouseRooms,
              as: "originHouseRoom",
              include: [
                {
                  model: Rooms,
                },
              ],
            },
            {
              model: HouseRooms,
              as: "destinationHouseRoom",
              include: [
                {
                  model: Rooms,
                },
              ],
            },
          ],
        },
        {
          model: HouseRooms,
          include: [
            {
              model: Rooms,
            },
            {
              model: RoomActuators,
              attributes: [
                "id",
                "houseRoomId",
                "actuatorId",
                "name",
                "createdAt",
                "updatedAt",
              ],
              include: [
                {
                  model: Actuators,
                },
              ],
            },
          ],
        },
      ],
    });

    // Mapeia os dados inserindo o `room.name` diretamente dentro de cada houseRoom
    const presetData = presetDataRaw.map((preset) => {
      const presetJSON = preset.toJSON();

      if (Array.isArray(presetJSON.houserooms)) {
        presetJSON.houserooms = presetJSON.houserooms.map((houseRoom) => ({
          ...houseRoom,
          name: houseRoom.room?.name || null,
        }));
      }

      return presetJSON;
    });

    res.status(200).json({ presetData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.users.id;

    const preset = await HousePresets.findOne({
      where: { id, userId },
      include: [
        {
          model: GraphRooms,
          attributes: [
            "id",
            "housePresetId",
            "originRoomId",
            "destinationRoomId",
            "distance",
            "createdAt",
            "updatedAt",
          ],
          include: [
            {
              model: HouseRooms,
              as: "originHouseRoom",
              include: [
                {
                  model: Rooms,
                },
              ],
            },
            {
              model: HouseRooms,
              as: "destinationHouseRoom",
              include: [
                {
                  model: Rooms,
                },
              ],
            },
          ],
        },
        {
          model: HouseRooms,
          include: [
            {
              model: Rooms,
            },
            {
              model: RoomActuators,
              attributes: [
                "id",
                "houseRoomId",
                "actuatorId",
                "name",
                "createdAt",
                "updatedAt",
              ],
              include: [
                {
                  model: Actuators,
                },
              ],
            },
          ],
        },
      ],
    });

    if (!preset) {
      return res.status(404).json({ error: "Preset not found" });
    }

    res.status(200).json({ preset });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.editById = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const userId = req.users.id;
    const { name, rooms, graphRooms } = req.body;

    const routinesCount = await PeopleRoutines.count({
      where: { housePresetId: id },
      transaction,
    });
    if (routinesCount > 0) {
      await transaction.rollback();
      return res.status(400).json({ error: "Cannot edit preset: there are routines using this preset." });
    }

    // Find preset
    const preset = await HousePresets.findOne({ where: { id, userId } });
    if (!preset) {
      await transaction.rollback();
      return res.status(404).json({ error: "Preset not found" });
    }

    // Update preset name
    await preset.update({ name }, { transaction });

    // Remove old rooms and actuators
    const oldHouseRooms = await HouseRooms.findAll({ where: { housePresetId: id }, transaction });
    // Remove dependent routineactivities and activitypresetparam first to avoid FK constraint errors
    const houseRoomIds = oldHouseRooms.map(houseRoom => houseRoom.id);
    if (houseRoomIds.length > 0) {
      // Dynamically require the models to avoid circular dependencies if necessary
      const activityPresetParams = await ActivityPresetParam.findAll({ where: { activityRoom: houseRoomIds }, transaction });
      const activityPresetParamIds = activityPresetParams.map(param => param.id);
      if (activityPresetParamIds.length > 0) {
        await RoutineActivities.destroy({ where: { activityPresetParam: activityPresetParamIds }, transaction });
        await ActivityPresetParam.destroy({ where: { id: activityPresetParamIds }, transaction });
      }
    }
    for (const houseRoom of oldHouseRooms) {
      await RoomActuators.destroy({ where: { houseRoomId: houseRoom.id }, transaction });
    }
    await HouseRooms.destroy({ where: { housePresetId: id }, transaction });

    // Remove old graph rooms
    await GraphRooms.destroy({ where: { housePresetId: id }, transaction });

    // Add new rooms and actuators
    for (const room of rooms) {
      if (!room?.roomName?.id) {
        throw new Error(`Room ID missing in: ${JSON.stringify(room)}`);
      }
      const houseRoom = await HouseRooms.create(
        {
          housePresetId: id,
          roomId: room.roomName.id,
        },
        { transaction }
      );
      for (const actuator of room.atuators || []) {
        if (!actuator?.id) {
          throw new Error(`Actuator ID missing in: ${JSON.stringify(actuator)}`);
        }
        // Ensure actuatorId is an integer
        const actuatorId = actuator.actuatorId;
        // Check if actuator exists in Actuators table
        const actuatorExists = await Actuators.findOne({ where: { id: actuatorId }, transaction });
        if (!actuatorExists) {
          throw new Error(`Actuator with ID ${actuatorId} does not exist in Actuators table.`);
        }
        await RoomActuators.create(
          {
            houseRoomId: houseRoom.id,
            actuatorId: actuatorId,
            name: actuator.name,
          },
          { transaction }
        );
      }
    }

    // Add new graph rooms
    for (const graph of graphRooms) {
      if (!graph?.room1?.id || !graph?.room2?.id) {
        throw new Error(`Connection IDs missing in: ${JSON.stringify(graph)}`);
      }
      const originHouseRoom = await HouseRooms.findOne({
        where: {
          housePresetId: id,
          roomId: graph.room1.id,
        },
        transaction,
      });
      const destinationHouseRoom = await HouseRooms.findOne({
        where: {
          housePresetId: id,
          roomId: graph.room2.id,
        },
        transaction,
      });
      if (!originHouseRoom || !destinationHouseRoom) {
        throw new Error(
          `HouseRoom not found for one of the rooms in: ${JSON.stringify(graph)}`
        );
      }
      await GraphRooms.create(
        {
          housePresetId: id,
          originRoomId: originHouseRoom.id,
          destinationRoomId: destinationHouseRoom.id,
          distance: graph.distance,
        },
        { transaction }
      );
    }

    await transaction.commit();
    return res.status(200).json({ message: "Preset updated successfully!" });
  } catch (err) {
    await transaction.rollback();
    console.error("Error editing preset:", err);
    return res.status(500).json({ error: "Error editing preset: " + err.message });
  }
};