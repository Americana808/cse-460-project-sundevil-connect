const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

//get all clubs
router.get('/', clubController.getAllClubs);

//get club by id
router.get('/:id', clubController.getClubById);

//create new club petition
router.post('/', clubController.createClub);

// update club
router.put('/:id', clubController.updateClub);

//delete club
router.delete('/:id', clubController.deleteClub);

//join a club
router.post('/:id/join', clubController.joinClub);

//leave a club
router.post('/:id/leave', clubController.leaveClub);

// approve club membership
router.post('/:id/approve', clubController.approveMembership);

// reject club membership
router.post('/:id/reject', clubController.rejectMembership);

module.exports = router;