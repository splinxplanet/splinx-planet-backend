const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticationToken } = require("../utils/validation");

// Get user profile
router.get("/get-user", authenticationToken, userController.getUserProfile);

// Update user profile
router.put("/update-user", authenticationToken, userController.updateUserProfile);

// Delete user profile
router.delete("/delete-user", authenticationToken, userController.deleteUserProfile);

module.exports = router;