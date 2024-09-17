const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailNotificationController');
const authenticationToken = require("../utils/validation"); // Auth middleware

// Send a new email to single or multiple recipients
/**
 * @swagger
 * /emails/send:
 *   post:
 *     summary: Send email to single or multiple users
 *     tags: [Emails]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               recipients:
 *                 type: array
 *                 items:
 *                   type: string
 *               html:
 *                 type: string
 *     responses:
 *       201:
 *         description: Email sent successfully
 */
router.post('/send', authenticationToken, emailController.sendEmailNotification);

// Resend an email by ID
/**
 * @swagger
 * /emails/{id}/resend:
 *   post:
 *     summary: Resend an existing email by ID
 *     tags: [Emails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the email to resend
 *     responses:
 *       200:
 *         description: Email resent successfully
 *       404:
 *         description: Email not found
 */
router.post('/:id/resend', authenticationToken, emailController.resendEmail);

// Delete an email by ID
/**
 * @swagger
 * /emails/{id}:
 *   delete:
 *     summary: Delete an email by ID
 *     tags: [Emails]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the email to delete
 *     responses:
 *       200:
 *         description: Email deleted successfully
 *       404:
 *         description: Email not found
 */
router.delete('/:id', authenticationToken, emailController.deleteEmail);

// Fetch all emails
/**
 * @swagger
 * /emails:
 *   get:
 *     summary: Fetch all sent emails
 *     tags: [Emails]
 *     responses:
 *       200:
 *         description: List of all emails
 */
router.get('/', authenticationToken, emailController.getAllEmails);

// Search emails by subject
/**
 * @swagger
 * /emails/search/{query}:
 *   get:
 *     summary: Search emails by subject
 *     tags: [Emails]
 *     parameters:
 *       - in: path
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search term for email subject
 *     responses:
 *       200:
 *         description: List of emails that match the query
 */
router.get('/search/:query', authenticationToken, emailController.searchEmails);

module.exports = router;
