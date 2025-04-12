const authenticationToken = require("../utils/validation");

const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Create a new event
/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       201:
 *         description: The event was created successfully.
 *       400:
 *         description: Bad request.
 */
router.post('/', authenticationToken, eventController.createEvent);

// Update an existing event
/**
 * @swagger
 * /events/{eventId}:
 *   put:
 *     summary: Update an existing event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: The event was updated successfully.
 *       400:
 *         description: Bad request.
 */
router.put('/:eventId', authenticationToken, eventController.updateEvent);

// new modification for event route
router.post("/events/:eventId/join-request", authenticationToken, eventController.requestToJoinEvent);
router.post("/events/:eventId/approve-request", authenticationToken, eventController.approveJoinRequest);
router.post("/events/:eventId/decline-request", authenticationToken, eventController.declineJoinRequest);


// Delete an event
/**
 * @swagger
 * /events/{eventId}:
 *   delete:
 *     summary: Delete an event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     responses:
 *       200:
 *         description: The event was deleted successfully.
 *       400:
 *         description: Bad request.
 */
router.delete('/:eventId', authenticationToken, eventController.deleteEvent);

// Get all events
/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: The list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/',  eventController.getAllEvents);

// Get a single event
/**
 * @swagger
 * /events/{eventId}:
 *   get:
 *     summary: Get a single event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     responses:
 *       200:
 *         description: The event.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.get('/:eventId', authenticationToken,  eventController.getEvent);

// Register a user for an event
/**
 * @swagger
 * /events/{eventId}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     responses:
 *       200:
 *         description: The user has been registered for the event.
 *       400:
 *         description: Bad request.
 */
router.post('/:eventId/register', authenticationToken,  eventController.registerForEvent);

// Invite app users to register for an event
/**
 * @swagger
 * /events/{eventId}/invite:
 *   post:
 *     summary: Invite users to an event
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The event ID
 *     responses:
 *       200:
 *         description: The users have been invited to the event.
 *       400:
 *         description: Bad request.
 */
router.post('/:eventId/invite', authenticationToken, eventController.inviteUsersToEvent);

// Get all events created by a user
/**
 * @swagger
 * /user-events/{userId}:
 *   get:
 *     summary: Get all events created by a user
 *     tags: [Events]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/user-events/:userId', eventController.getEventsByUser);

// split event cost among members
/**
 * @swagger
 * /split-cost/{eventId}:
 *   post:
 *     summary: Split the cost of an event among members
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to split the cost for
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SplitCost'
 *     responses:
 *       200:
 *         description: Split cost successfully
 *       400:
 *         description: Bad request
 */
router.post('/split-cost/:eventId', authenticationToken, eventController.splitCost);

// pay split cost
/**
 * @swagger
 * /pay-split-cost:
 *   post:
 *     summary: Pay a split cost for an event
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaySplitCost'
 *     responses:
 *       200:
 *         description: Split cost payment successful
 *       400:
 *         description: Bad request
 */
router.post('/pay-split-cost', authenticationToken, eventController.paySplitCost);

// fetch all split costs
/**
 * @swagger
 * /fetch-split-costs/{userId}:
 *   get:
 *     summary: Fetch all split costs for a user
 *     tags: [Bills]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to fetch split costs for
 *     responses:
 *       200:
 *         description: List of split costs for the user
 *       404:
 *         description: User or split costs not found
 */
router.get('/fetch-split-costs/:userId', authenticationToken, eventController.fetchAllSplitBills);

// fetch event members info
/**
 * @swagger
 * /events/{eventId}/members:
 *   get:
 *     summary: Fetch event members information
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to fetch members for
 *     responses:
 *       200:
 *         description: Event members information
 *       404:
 *         description: Event not found
 */
router.get('/events/:eventId/members', authenticationToken, eventController.fetchEventMembersInfo);

// Route to update any event property
/**
 * @swagger
 * /event/{eventId}:
 *   put:
 *     summary: Update any property of an event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EventUpdate'
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       404:
 *         description: Event not found
 */
router.put('/event/:eventId', eventController.updateEvent);

// send payment reminder
/**
 * @swagger
 * /send-payment-reminder:
 *   post:
 *     summary: Send payment reminder to event members
 *     tags: [Events, Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentReminder'
 *     responses:
 *       200:
 *         description: Payment reminders sent successfully
 *       404:
 *         description: Event not found
 */
router.post('/send-payment-reminder', authenticationToken, eventController.sendPaymentReminder);

module.exports = router;

