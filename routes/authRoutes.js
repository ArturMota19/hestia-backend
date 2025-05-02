const express = require('express');
const { register, login, verifyTokenPost } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verifyUserToken', verifyTokenPost);

module.exports = router;
