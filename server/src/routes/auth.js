const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

//get auth token
router.post('/token', eventController.getAuthToken);

module.exports = router;