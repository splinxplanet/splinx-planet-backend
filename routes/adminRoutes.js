const express = require('express');
const {
  createAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  forgotPassword,
} = require('../controllers/adminController');
const router = express.Router();
const authenticationToken = require("../utils/validation"); // Auth middleware

/**
 * @swagger
 * /admin-create:
 *   post:
 *     summary: Create a new admin account
 *     description: Endpoint to create a new admin account.
 *     tags: [Admin]
 *     requestBody:
 *       description: Provide admin details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: yourPassword
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/admin-create', authenticationToken, createAdmin);

/**
 * @swagger
 * /admin-login:
 *   post:
 *     summary: Admin login
 *     description: Login an admin using email and password.
 *     tags: [Admin]
 *     requestBody:
 *       description: Provide login credentials
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: yourPassword
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/admin-login', loginAdmin);

/**
 * @swagger
 * /admin-get-all:
 *   get:
 *     summary: Get all admins
 *     description: Fetch all admins with pagination options.
 *     tags: [Admin]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - name: limit
 *         in: query
 *         description: Number of admins to fetch per page
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of admins
 *       400:
 *         description: Invalid pagination parameters
 */
router.get('/admin-get-all', authenticationToken, getAllAdmins);

/**
 * @swagger
 * /get-admin/{id}:
 *   get:
 *     summary: Get admin by ID
 *     description: Fetch details of a specific admin by their ID.
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin details fetched
 *       404:
 *         description: Admin not found
 */
router.get('/get-admin/:id', authenticationToken, getAdminById);

/**
 * @swagger
 * /admin-update/{id}:
 *   put:
 *     summary: Update an admin account
 *     description: Edit the details of an admin account by ID.
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Provide updated admin details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: newPassword
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Invalid input
 */
router.put('/admin-update/:id', authenticationToken, updateAdmin);

/**
 * @swagger
 * /admin-delete/{id}:
 *   delete:
 *     summary: Delete an admin account
 *     description: Remove an admin account by ID.
 *     tags: [Admin]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 */
router.delete('/admin-delete/:id', authenticationToken, deleteAdmin);

/**
 * @swagger
 * /admin-forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Request a password reset for an admin account.
 *     tags: [Admin]
 *     requestBody:
 *       description: Provide email to receive password reset instructions
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *     responses:
 *       200:
 *         description: Password reset instructions sent
 *       404:
 *         description: Admin not found
 */
router.post('/admin-forgot-password', forgotPassword);

module.exports = router;
