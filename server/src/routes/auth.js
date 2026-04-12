const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// register user
router.post('/register', authController.register);

// login user
router.post('/login', authController.login);

// logout user
router.post('/logout', authController.logout);

module.exports = router;