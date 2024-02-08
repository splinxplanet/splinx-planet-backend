const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticationToken } = require("../utils/validation");

// Get user profile
router.get("/get-user/:userId", authenticationToken, userController.getUserProfile);

// Update user profile
router.put("/update-user/:userId", authenticationToken, userController.updateUserProfile);

// Delete user profile
router.delete("/delete-user/:userId", authenticationToken, userController.deleteUserProfile);

module.exports = router;