const express = require('express');
const { register, getByPresetId } = require('../controllers/peoplePriorityController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.post('/register', auth , register);
router.get('/getByPresetId/:id', getByPresetId) // TODO: COLOCAR AUTH

module.exports = router;