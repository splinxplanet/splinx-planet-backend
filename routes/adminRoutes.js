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

// Create new admin
router.post('/create', createAdmin);

// Admin login
router.post('/login', loginAdmin);

// Fetch all admins with pagination
router.get('/', getAllAdmins);

// Fetch a single admin by ID
router.get('/:id', getAdminById);

// Edit an admin account
router.put('/:id', updateAdmin);

// Delete an admin account
router.delete('/:id', deleteAdmin);

// Forgot password
router.post('/forgot-password', forgotPassword);

module.exports = router;
