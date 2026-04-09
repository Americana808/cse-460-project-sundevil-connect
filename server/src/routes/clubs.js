const express = require('express');
const router = express.Router();
const clubController = require('../controllers/clubController');

// club routes
//get all clubs
router.get('/', clubController.getAllClubs);

//get club by id
router.get('/:id', clubController.getClubById);

//petition new club
router.post('/', clubController.createClub);

// update club admin
router.put('/:id', clubController.updateClub);

//delete club admin
router.delete('/:id', clubController.deleteClub);

// approve club membership admin
router.post('/:id/approve', clubController.approveMembership);

// reject club membership admin
router.post('/:id/reject', clubController.rejectMembership);

// club membership routes
//student jopin club
router.post('/:id/join', clubController.joinClub);

// get club members
router.get('/:id/members', clubController.getClubMembers);

//club member approved by leadership
router.post('/:id/members/:memberId/approve', clubController.approveMembership);

// club member rejected by leadership
router.post('/:id/members/:memberId/reject', clubController.rejectMembership);

// remove club member
router.delete('/:id/members/:memberId', clubController.removeMember);

// club posts routes
// get all posts for club
router.get('/:id/posts', clubController.getClubPosts);

// create new post for club
router.post('/:id/posts', clubController.createClubPost);

// update club post
router.put('/:id/posts/:postId', clubController.updateClubPost);

// delete club post
router.delete('/:id/posts/:postId', clubController.deleteClubPost);

module.exports = router;