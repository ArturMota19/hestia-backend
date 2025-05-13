const HousePresets = require("../models/HousePresets")
const RoomActuators = require("../models/RoomActuators")
const HouseRooms = require("../models/HouseRooms")
const GraphRooms = require("../models/GraphRooms");
const sequelize = require("../config/db");

exports.register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, rooms, graphRooms } = req.body;
    const userId = req.user.id;

    const housePreset = await HousePresets.create({ userId, name }, { transaction });

    for (const room of rooms) {
      if (!room?.roomName?.id) {
        throw new Error(`Room ID missing in: ${JSON.stringify(room)}`);
      }

      const houseRoom = await HouseRooms.create({
        housePresetId: housePreset.id,
        roomId: room.roomName.id,
      }, { transaction });

      for (const actuator of room.atuators || []) {
        if (!actuator?.id) {
          throw new Error(`Actuator ID missing in: ${JSON.stringify(actuator)}`);
        }
        // all the props of the actuators will be defined in routine
        await RoomActuators.create({
          houseRoomId: houseRoom.id,
          actuatorId: actuator.id,
          name: actuator.name
        }, { transaction });
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
        throw new Error(`HouseRoom not found for one of the rooms in: ${JSON.stringify(graph)}`);
      }

      await GraphRooms.create({
        housePresetId: housePreset.id,
        originRoomId: originHouseRoom.id,
        destinationRoomId: destinationHouseRoom.id,
        distance: graph.distance,
      }, { transaction });
    }

    await transaction.commit();
    return res.status(201).json({ message: 'Preset created successfully!', housePreset });

  } catch (err) {
    await transaction.rollback();
    console.error('Error registering preset:', err);
    return res.status(500).json({ error: 'Error creating preset: ' + err.message });
  }
};
