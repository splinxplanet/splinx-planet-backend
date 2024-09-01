const authenticationToken = require("../utils/validation");

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create a new event
router.post('/', authenticationToken, eventController.createEvent);

// Update an existing event
router.put('/:eventId', authenticationToken, eventController.updateEvent);

// Delete an event
router.delete('/:eventId', authenticationToken, eventController.deleteEvent);

// Get all events
router.get('/', authenticationToken, eventController.getAllEvents);

// Get a single event
router.get('/:eventId', authenticationToken,  eventController.getEvent);

// Register a user for an event
router.post('/:eventId/register', authenticationToken,  eventController.registerForEvent);

// Invite app users to register for an event
router.post('/:eventId/invite', authenticationToken, eventController.inviteUsersToEvent);

// Get all events created by a user
router.get('/user-events/:userId', eventController.getEventsByUser);

// split event cost among members
router.post('/split-cost/:eventId', authenticationToken, eventController.splitCost);

// pay split cost
router.post('/pay-split-cost', authenticationToken, eventController.paySplitCost);

// fetch all split costs
router.get('/fetch-split-costs/:userId', authenticationToken, eventController.fetchAllSplitBills);

// fetch event members info
router.get('/events/:eventId/members', authenticationToken, eventController.fetchEventMembersInfo);

// Route to update any event property
router.put('/event/:eventId', eventController.updateEvent);

module.exports = router;
