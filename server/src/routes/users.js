const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// get user profile
router.get('/:id', eventController.getUserProfile);

// update user profile
router.put('/:id', eventController.updateUserProfile);

module.exports = router;