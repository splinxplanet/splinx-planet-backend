const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// dotenv config
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// Register user
exports.registerUser = async (req, res) => {
    const { emailAddress, password } = req.body;
  // Check if user exists
  const existingUser = await User.findOne({ emailAddress });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user
  const newUser = new User({
    ...req.body,
    password: hashedPassword,
  });

  // Save user to database
  await newUser.save();

  res.status(201).json({ message: "User registered successfully" });
};

// Login user
exports.loginUser = async (req, res) => {
  // Extract email and password from request body
  const { emailAddress, password } = req.body;

  // Find user by email
  const user = await User.findOne({ emailAddress });

  // Check if user exists
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Compare passwords
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
};

// forgot password
exports.forgotPassword = async (req, res) => {
  // Extract email from request body
  const { emailAddress } = req.body;

  // Find user by email
    const user = await User.findOne({
        emailAddress,
    });

    // Check if user exists
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, keys.jwtSecret, {
        expiresIn: "1h",
    });

    // Send email with token
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    // Send email with reset link
    // ... (send email logic here)
    res.json({ message: "Password reset link sent to your email" });
}


