// routes/search.route.js

const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { validateSearchRequest } = require('../validators/searchValidator');

router.get('/search', validateSearchRequest, searchController.getSearchSuggestions);

module.exports = router;