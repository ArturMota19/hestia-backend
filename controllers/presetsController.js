const HousePresets = require("../models/HousePresets")
const RoomActuators = require("../models/RoomActuators")
const HouseRooms = require("../models/HouseRooms")
const GraphRooms = require("../models/GraphRooms");
const Actuators = require("../models/Actuators")
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
          as: "GraphRooms",
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
              as: "originRoom",
              include: [
                {
                  model: Rooms,
                  as: "Room",
                },
              ],
            },
            {
              model: HouseRooms,
              as: "destinationRoom",
              include: [
                {
                  model: Rooms,
                  as: "Room",
                },
              ],
            },
          ],
        },
        {
          model: HouseRooms,
          as: "HouseRooms",
          include: [
            {
              model: Rooms,
              as: "Room",
            },
            {
              model: RoomActuators,
              as: "RoomActuators",
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
                  as: "actuator",
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

    const presetData = await HousePresets.findAll({
      where: { userId },
      include: [
        {
          model: GraphRooms,
          as: "GraphRooms",
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
              as: "originRoom",
              include: [
                {
                  model: Rooms,
                  as: "Room",
                },
              ],
            },
            {
              model: HouseRooms,
              as: "destinationRoom",
              include: [
                {
                  model: Rooms,
                  as: "Room",
                },
              ],
            },
          ],
        },
        {
          model: HouseRooms,
          as: "HouseRooms",
          include: [
            {
              model: Rooms,
              as: "Room",
            },
            {
              model: RoomActuators,
              as: "RoomActuators",
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
                  as: "actuator",
                },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).json({ presetData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

