const express = require('express');
const { searchUsers } = require('../controllers/searchController');
const router = express.Router();

router.get('/users', searchUsers);

module.exports = router;