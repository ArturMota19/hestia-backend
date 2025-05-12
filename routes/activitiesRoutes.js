const express = require('express');
const { register } = require('../controllers/activitiesController');
const { auth } = require('../helpers/authHelper');

const router = express.Router();

router.post('/register', auth, register);

module.exports = router;