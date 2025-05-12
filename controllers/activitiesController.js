const Activities = require("../models/Activities")

// exports.register = async (req, res) => {
//   try {
//     const { name } = req.body;

//     const people = await Activities.create({ name});
//     res.status(201).json({ message: 'People registered', user });
//   } catch (err) {
//     console.log(err)
//     res.status(500).json({ error: err.message });
//   }
// };