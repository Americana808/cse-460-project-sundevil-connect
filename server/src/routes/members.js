const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

//get all members
router.get('/', eventController.getAllMembers);

//get member by id
router.get('/:id', eventController.getMemberById);



module.exports = router;