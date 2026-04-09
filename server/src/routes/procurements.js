const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// get all procurements
router.get('/', eventController.getAllProcurements);

// club leadership create procurement request
router.post('/', eventController.createProcurement);

// advisor approve procurement request
router.post('/:id/approve', eventController.approveProcurement);

// advisor reject procurement request
router.post('/:id/reject', eventController.rejectProcurement);

module.exports = router;