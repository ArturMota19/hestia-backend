const express = require('express');
const { register, getAll } = require('../controllers/presetsController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.post('/register', auth ,register);
router.get('/getAll/:page', auth, getAll)
module.exports = router;