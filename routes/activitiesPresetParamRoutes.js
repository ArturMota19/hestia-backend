const express = require('express');
const { register, getAll, deleteById, getById } = require('../controllers/activitiesPresetParamController');
const { auth } = require('../helpers/authHelper');

const router = express.Router();

router.post('/register', auth, register);
router.get('/getAll/:page', auth, getAll);
router.delete('/deleteById/:id', auth, deleteById)
router.get('/getById/:id', auth, getById)

module.exports = router;
