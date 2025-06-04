const Actuators = require("../models/Actuators")
const HouseRooms = require("../models/HouseRooms")
const RoomActuators = require("../models/RoomActuators")
const Rooms = require("../models/Rooms")
const GraphRooms = require("../models/GraphRooms")



exports.generateFinalFile = async (req, res) => {
  try {
    const {presetId} = req.params
    const finalData = []
    console.log(presetId)

    // Step 1 - Get all actuators
    const actuators = await Actuators.findAll()
    if(!actuators){
      throw new Error("No actuators found");
    }
    finalData.push({ actuators })
    // Step 2 - Get all rooms in this preset
    const houseRooms = await HouseRooms.findAll({
      where: { housePresetId: presetId },
      include: [
      {
        model: Rooms,
      },
      {
        model: RoomActuators,
        include: [
        {
          model: Actuators,
        },
        ],
      },
      ],
    });
    finalData.push({ rooms: houseRooms });

    // Step 3 - Get the graph (connections) between rooms in this preset
    const graphRooms = await GraphRooms.findAll({
      where: { housePresetId: presetId },
      include: [
        {
          model: HouseRooms,
          as: 'originHouseRoom',
          include: [{ model: Rooms }]
        },
        {
          model: HouseRooms,
          as: 'destinationHouseRoom',
          include: [{ model: Rooms }]
        }
      ]
    });
    finalData.push({ graph: graphRooms });


    res.status(200).json({ message: "OK", finalData });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.checkFileValidation = async (req, res) => {
  try {
    res.status(201).json({ message: "OK" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};


