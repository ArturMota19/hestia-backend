const express = require('express');
const { getAll } = require('../controllers/actuatorsController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.get('/getAll', auth, getAll);

module.exports = router;