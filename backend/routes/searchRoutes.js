const express = require('express');
const { searchUsers } = require('../controllers/searchController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/users',authMiddleware , searchUsers);

module.exports = router;