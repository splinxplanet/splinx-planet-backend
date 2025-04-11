const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
// dotenv config
require("dotenv").config();
const cloudinary = require("../utils/imageUpload");

const JWT_SECRET = process.env.JWT_SECRET;
const TEXTFLOW_API_KEY = process.env.TEXTFLOW_KEY;

// phone number otp verification
const textflow = require("textflow.js");

textflow.useKey(TEXTFLOW_API_KEY);
// send otp verification code
exports.sendOTP = async (req, res) => {
   const { phoneNumber } = req.body
    console.log("Phone number", phoneNumber)
    let result = await textflow.sendVerificationSMS(phoneNumber);
    console.log(result)
    if (result.ok)
        return res.status(200).json({ success: true });

    return res.status(400).json({ success: false });
}
// verify otp
exports.verifyOTP = async (req, res) => {
    const { phoneNumber, otpCode } = req.body

    let result = await textflow.verifyCode(phoneNumber, otpCode);

    if(!result.valid){
        return res.status(400).json({ success: false });
    }

    return res.status(400).json({ success: true });
}

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
    expiresIn: "1d",
  });

  // send user profile and token
  const userProfile = {
    _id: user._id,
    createdAt: user.createdAt,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    phoneNumber: user.phoneNumber,
    profileImg: user.profileImg,
    enableNotification: user.enableNotification,
    enableSmsNotification: user.enableSmsNotification,
    enableEmailNotification: user.enableEmailNotification,
    isSubscriber: user.isSubscriber,
    subscriptionPlan: user.subscriptionPlan,
    isWalletCreated: user.isWalletCreated,
    walletAccountNumber: user.walletAccountNumber,
    country: user.country,
    city: user.city,
    currency: user.currency,
    currencySymbol: user.currencySymbol,
    homeAddress: user.homeAddress,
    dob: user.dob,
    age: user.age,
    bio: user.bio,
    myInterest: user.myInterest,
    hashtagFollowing: user.hashtagFollowing,
    restrictedAccount: user.restrictedAccount
  }

  res.json({ token, userProfile});
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

// Check if a user exists by phone number
exports.checkUserByPhoneNumber = async (req, res) => {
  const { phoneNumber } = req.body;

  // Validate phone number
  if (!phoneNumber) {
    return res.status(400).json({ message: "Phone number is required" });
  }

  try {
    // Find user by phone number
    const user = await User.findOne({ phoneNumber });

    if (user) {
      // User exists
      return res.status(200).json({ exists: true });
    } else {
      // User does not exist
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking user by phone number:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



