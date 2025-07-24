const express = require('express');
const { register, getAll, getAllWithoutPage, getById, editById} = require('../controllers/presetsController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.post('/register', auth ,register);
router.get('/getByid/:id', auth, getById)
router.put('/editById/:id', auth, editById)
router.get('/getAll/:page', auth, getAll)
router.get('/getAllWithoutPage', auth, getAllWithoutPage)
module.exports = router;