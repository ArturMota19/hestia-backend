const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require("../models/Users");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const users = await Users.create({
      name,
      email,
      password: hashedPassword,
      isSearcherUFBA: false,
      isAdmin: false,
    });
    res.status(201).json({ message: "Users registered", users });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await Users.findOne({ where: { email } });
    if (!users) {
      return res.status(404).json({ error: "Users not found" });
    }

    const isMatch = await bcrypt.compare(password, users.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: users.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
