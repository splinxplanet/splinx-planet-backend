const express = require('express');
const router = express.Router();

// Import all necessary modules
const chatControllers = require("../controllers/chat.controllers.js");
const authMiddlewares = require("../middlewares/auth.middlewares.js");
const chatValidators = require("../validators/chat.validators.js");
const mongodbValidators = require("../validators/mongodb.validators.js");
const validate = require("../validators/validate.js");

// Destructure functions from imported modules
const {
  addNewParticipantInGroupChat,
  createAGroupChat,
  createOrGetAOneOnOneChat,
  deleteGroupChat,
  deleteOneOnOneChat,
  getAllChats,
  getGroupChatDetails,
  leaveGroupChat,
  removeParticipantFromGroupChat,
  renameGroupChat,
  searchAvailableUsers,
} = chatControllers;

const { verifyJWT } = authMiddlewares;
const {
  createAGroupChatValidator,
  updateGroupChatNameValidator,
} = chatValidators;
const { mongoIdPathVariableValidator } = mongodbValidators;

// Apply JWT verification to all routes in this router
router.use(verifyJWT);

// Route for getting all chats
router.get("/", getAllChats);

// Route for searching available users
router.get("/users", searchAvailableUsers);

// Route for creating or getting a one-on-one chat
router.post(
  "/c/:receiverId",
  mongoIdPathVariableValidator("receiverId"),
  validate,
  createOrGetAOneOnOneChat
);

// Route for creating a group chat
router.post("/group", createAGroupChatValidator(), validate, createAGroupChat);

// Route for getting, updating, or deleting a group chat
router
  .route("/group/:chatId")
  .get(
    mongoIdPathVariableValidator("chatId"),
    validate,
    getGroupChatDetails
  )
  .patch(
    mongoIdPathVariableValidator("chatId"),
    updateGroupChatNameValidator(),
    validate,
    renameGroupChat
  )
  .delete(
    mongoIdPathVariableValidator("chatId"),
    validate,
    deleteGroupChat
  );

// Route for adding or removing participants from a group chat
router
  .route("/group/:chatId/:participantId")
  .post(
    mongoIdPathVariableValidator("chatId"),
    mongoIdPathVariableValidator("participantId"),
    validate,
    addNewParticipantInGroupChat
  )
  .delete(
    mongoIdPathVariableValidator("chatId"),
    mongoIdPathVariableValidator("participantId"),
    validate,
    removeParticipantFromGroupChat
  );

// Route for leaving a group chat
router
  .route("/leave/group/:chatId")
  .delete(mongoIdPathVariableValidator("chatId"), validate, leaveGroupChat);

// Route for deleting a one-on-one chat
router
  .route("/remove/:chatId")
  .delete(mongoIdPathVariableValidator("chatId"), validate, deleteOneOnOneChat);

module.exports = router;