const express = require('express');
const router = express.Router();

const clubRoutes = require('./clubs');
const eventRoutes = require('./events');
const userRoutes = require('./users');
const authRoutes = require('./auth');
const procurementRoutes = require('./procurement');

router.use('/clubs', clubRoutes);
router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/auth', authRoutes);
router.use('/procurement', procurementRoutes);

module.exports = router;