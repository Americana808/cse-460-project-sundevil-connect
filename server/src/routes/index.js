const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate');

const clubRoutes = require('./clubs');
const eventRoutes = require('./events');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const procurementRoutes = require('./procurements');
const flagRoutes = require('./flags');

// public routes
router.use('/auth', authRoutes);

// protected routes — require valid JWT
router.use(authenticate);
router.use('/clubs', clubRoutes);
router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/procurement', procurementRoutes);
router.use('/flags', flagRoutes);

module.exports = router;