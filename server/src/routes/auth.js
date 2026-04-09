const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// register user
router.post('/register', eventController.registerUser);

// login user
router.post('/login', eventController.loginUser);

// logout user
router.post('/logout', eventController.logoutUser);

module.exports = router;