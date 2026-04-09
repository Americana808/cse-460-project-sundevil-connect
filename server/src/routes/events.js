const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

//get all events
router.get('/', eventController.getAllEvents);

//get event by id
router.get('/:id', eventController.getEventById);

//create new event
router.post('/', eventController.createEvent);

// update event
router.put('/:id', eventController.updateEvent);

//delete event
router.delete('/:id', eventController.deleteEvent);

module.exports = router;