const express = require('express');
const { getAll, getAllWithoutPagination } = require('../controllers/actuatorsController');
const {auth} = require("../helpers/authHelper")

const router = express.Router();

router.get('/getAll/:page', auth, getAll);
router.get('/getAllWithoutPagination', auth, getAllWithoutPagination)

module.exports = router;