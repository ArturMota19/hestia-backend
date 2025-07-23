const express = require('express');
const { register, getAll, getAllWithoutPage, deleteById, getByFilter } = require('../controllers/peopleController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.post('/register', auth ,register);
router.get('/getAll/:page', auth, getAll);
router.get('/getByFilter/:nameFilter', auth, getByFilter);
router.get('/getAllWithoutPage', auth, getAllWithoutPage)
router.delete('/deleteById/:id', auth, deleteById)

module.exports = router;