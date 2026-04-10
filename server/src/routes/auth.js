const express = require('express');
const router = express.Router();
const eventController = require('../controllers/authController');

// register user
router.post('/register', authController.registerUser);

// login user
router.post('/login', authController.loginUser);

// logout user
router.post('/logout', authController.logoutUser);

module.exports = router;