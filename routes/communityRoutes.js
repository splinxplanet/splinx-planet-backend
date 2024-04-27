// community routes

const express = require('express');
const router = express.Router();
const communityController = require('../controllers/communityController');

// Routes
router.post('/', communityController.createCommunity);
router.get('/:id', communityController.getCommunityById);
router.put('/:id/add-member', communityController.addMember);
router.put('/:id/remove-member', communityController.removeMember);
router.delete('/:id', communityController.deleteCommunity);

module.exports = router;
