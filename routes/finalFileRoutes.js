const express = require('express');
const {auth} = require("../helpers/authHelper")
const { generateFinalFile, checkFileValidation } = require('../controllers/finalFileController');

const router = express.Router();

router.get('/generateFinalFile/:presetId', generateFinalFile);
router.post('/checkFileValidation', auth, checkFileValidation)

module.exports = router;
