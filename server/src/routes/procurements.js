const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

//get all members
router.get('/', eventController.getAllMembers);

module.exports = router;