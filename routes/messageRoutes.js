const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// endpoint to post new message and store
router.post('/messages', upload.single("imageFile"), messageController.postMessage);

// endpoint to get userDetails to create chatroom
router.get('/user/:userId', messageController.getUserDetails);

// endpoint to fetch messages between user
router.get('/messages/:senderId/:recipientId', messageController.fetchMessages);

// endpoint to delete messages
router.delete('/deleteMessage', messageController.deleteMessage);