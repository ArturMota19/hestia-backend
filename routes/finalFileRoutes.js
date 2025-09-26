const express = require('express');
const {auth} = require("../helpers/authHelper")
const { generateFinalFile, checkFileValidation, generateData } = require('../controllers/finalFileController');

const router = express.Router();

router.get('/generateFinalFile/:presetId', auth, generateFinalFile);
router.post('/checkFileValidation', auth, checkFileValidation)
router.post('/generateData',auth , generateData);

module.exports = router;
