const express = require('express');
const router = express.Router();

const clubRoutes = require('./clubs');
const eventRoutes = require('./events');
const membersRoutes = require('./members');
const authRoutes = require('./auth');
const procurementRoutes = require('./procurement');

router.use('/clubs', clubRoutes);
router.use('/events', eventRoutes);
router.use('/members', membersRoutes);
router.use('/auth', authRoutes);
router.use('/procurement', procurementRoutes);

module.exports = router;