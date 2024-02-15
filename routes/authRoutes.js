const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
// const multer = require("multer");

// multer setup
// const storage = multer.diskStorage({});

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb("Invalid image file!", false);
//   }
// };
// const uploads = multer({ storage, fileFilter });

// Register user
router.post("/register", authController.registerUser);

// Login user
router.post("/login", authController.loginUser);

// Forgot password
router.post("/forgot-password", authController.forgotPassword);

module.exports = router;