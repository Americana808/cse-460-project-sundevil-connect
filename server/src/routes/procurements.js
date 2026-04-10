const express = require('express');
const router = express.Router();
const eventController = require('../controllers/procurementController');

// get all procurements
router.get('/', procurementController.getAllProcurements);

// club leadership create procurement request
router.post('/', procurementController.createProcurement);

// advisor approve procurement request
router.post('/:id/approve', procurementController.approveProcurement);

// advisor reject procurement request
router.post('/:id/reject', procurementController.rejectProcurement);

module.exports = router;