const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// get user profile
router.get('/:id', userController.getUserProfile);

// update user profile
router.put('/:id', userController.updateUserProfile);

module.exports = router;