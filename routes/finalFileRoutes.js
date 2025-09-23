const express = require('express');
const {auth} = require("../helpers/authHelper")
const { generateFinalFile, checkFileValidation, teste } = require('../controllers/finalFileController');

const router = express.Router();

router.get('/generateFinalFile/:presetId', generateFinalFile);
router.post('/checkFileValidation', auth, checkFileValidation)
router.get('/teste', teste);

module.exports = router;
