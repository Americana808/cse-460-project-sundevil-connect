const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// event routes
//get all events
router.get('/', eventController.getAllEvents);

//get event by id
router.get('/:id', eventController.getEventById);

//create new event by club leadership
router.post('/', eventController.createEvent);

// update event by club leadership
router.put('/:id', eventController.updateEvent);

//delete event by club leadership
router.delete('/:id', eventController.deleteEvent);

//event registration routes
// student register for event
router.post('/:id/register', eventController.registerForEvent);

// student unregister for event
router.post('/:id/unregister', eventController.unregisterForEvent);

// get event attendees
router.get('/:id/attendees', eventController.getEventAttendees);

module.exports = router;