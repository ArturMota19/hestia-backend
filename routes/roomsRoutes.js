const express = require('express');
const { register, getAll, getSelf, deleteById } = require('../controllers/roomsController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.post('/register', auth ,register);
router.get('/getAll/:page', auth, getAll);
router.get('/getSelf', auth, getSelf)
router.delete('/deleteById/:id', auth, deleteById)
module.exports = router;