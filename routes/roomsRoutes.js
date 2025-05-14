const express = require('express');
const { register, getAll, getSelf } = require('../controllers/roomsController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.post('/register', auth ,register);
router.get('/getAll/:page', auth, getAll);
router.get('/getSelf', auth, getSelf)
module.exports = router;