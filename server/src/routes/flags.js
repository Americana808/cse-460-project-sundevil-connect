const express = require('express');
const router = express.Router();
const flagController = require('../controllers/flagController');

// any user flags content
router.post('/', flagController.createFlag);

// admin view all flags
router.get('/', flagController.getAllFlags);

// admin resolve flag
router.put('/:id/resolve', flagController.resolveFlag);

module.exports = router;