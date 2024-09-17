const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticationToken = require("../utils/validation"); // Auth middleware

/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - title
 *         - message
 *         - type
 *         - userId
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the notification
 *         title:
 *           type: string
 *           description: Title of the notification
 *         message:
 *           type: string
 *           description: The content of the notification
 *         type:
 *           type: string
 *           enum: [system, personal, alert]
 *           description: Type of the notification
 *         userId:
 *           type: string
 *           description: The ID of the user for whom the notification is created
 *         read:
 *           type: boolean
 *           description: Notification read status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the notification was created
 */

/**
 * @swagger
 * /notifications/create:
 *   post:
 *     summary: Create a new notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Notification'
 *     responses:
 *       201:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */
router.post('/create', authenticationToken, notificationController.createNotification);

/**
 * @swagger
 * /notifications/system:
 *   get:
 *     summary: Fetch all system notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of system notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */
router.get('/system', authenticationToken, notificationController.getSystemNotifications);

/**
 * @swagger
 * /notifications/{userId}:
 *   get:
 *     summary: Get all notifications for a specific user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve notifications for
 *     responses:
 *       200:
 *         description: List of notifications for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notification'
 *       500:
 *         description: Server error
 */
router.get('/:userId', authenticationToken, notificationController.getNotificationsForUser);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notification'
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.put('/:id/read', authenticationToken, notificationController.markAsRead);

/**
 * @swagger
 * /notifications/send-multiple:
 *   post:
 *     summary: Send notification to multiple users
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               message:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [system, personal, alert]
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               title: "New Update"
 *               message: "A new feature has been added."
 *               type: "system"
 *               userIds: ["userId1", "userId2"]
 *     responses:
 *       201:
 *         description: Notifications sent successfully
 *       500:
 *         description: Server error
 */
router.post('/send-multiple', authenticationToken, notificationController.sendNotificationToMultipleUsers);

/**
 * @swagger
 * /notifications/{id}/resend:
 *   post:
 *     summary: Resend an existing notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to resend
 *     responses:
 *       200:
 *         description: Notification resent successfully
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.post('/:id/resend', authenticationToken, notificationController.resendNotification);

/**
 * @swagger
 * /notifications/{id}/delete:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Server error
 */
router.delete('/:id/delete', authenticationToken, notificationController.deleteNotification);

module.exports = router;
