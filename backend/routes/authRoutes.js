const express = require('express');
const { register, login, isLoggedIn, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/isLoggedIn', isLoggedIn);
router.get('/logout', logout);

module.exports = router;
