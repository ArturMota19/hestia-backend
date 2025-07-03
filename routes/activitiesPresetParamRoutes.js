const express = require('express');
const { register, getAll, deleteById } = require('../controllers/activitiesPresetParamController');
const { auth } = require('../helpers/authHelper');

const router = express.Router();

router.post('/register', auth, register);
router.get('/getAll/:page', auth, getAll);
router.delete('/deleteById/:id', auth, deleteById)

module.exports = router;
