const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticationToken = require("../utils/validation");

// Get user profile
router.get("/get-user/:userId", authenticationToken, userController.getUserProfile);

// get all user profileImg, firstName, id, emailAddress
router.get("/get-all-users", authenticationToken, userController.getAllUsersProfile);

// Update user profile
router.put("/update-user/:userId", authenticationToken, userController.updateUserProfile);

// Delete user profile
router.delete("/delete-user/:userId", authenticationToken, userController.deleteUserProfile);

// send friend request
router.post("/friend-request", authenticationToken, userController.sendFriendRequest);

// get all friend request
router.get("/friend-request/:userId", authenticationToken, userController.showAllFriendRequest);

// get all sent friend request
router.get("/sent-friend-request/:userId", authenticationToken, userController.getSentFriendRequests);

// accept friend request
router.post("/friend-request/accept", authenticationToken, userController.acceptFriendRequest);

// get all login friends
router.get("/accepted-friends/:userId", authenticationToken, userController.loginFriends);

// get user friends
router.get("/friends/:userId", authenticationToken, userController.getUserFriends);

// get all users
router.get("/all-users/:userId", authenticationToken, userController.getAllUsers);

module.exports = router;