const express = require('express');
const { register } = require('../controllers/peoplePriorityController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.post('/register', auth ,register);

module.exports = router;