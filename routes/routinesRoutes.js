const express = require('express');
const { register, registerPeopleDayRoutines, getPeopleRoutinesByPresetId } = require('../controllers/routinesController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.post('/register', auth ,register);
router.post('/registerPeopleDayRoutines', auth, registerPeopleDayRoutines)
router.get('/getPeopleRoutinesByPresetId/:housePresetId', auth, getPeopleRoutinesByPresetId)

module.exports = router;