const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const sendEmail = require('../utils/sendEmail');
const nodemailer = require('nodemailer');

// Utility function to generate JWT token
const generateToken = (admin) => {
  return jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, emailAddress, password, phoneNumber, userName, ...rest } = req.body;

    const newAdmin = await Admin.create({
      firstName,
      lastName,
      emailAddress,
      password,
      phoneNumber,
      userName,
      ...rest,
    });

      // Send email with login details
      await sendEmail(emailAddress, 'Admin Account Created', `Your account has been created. Login with username: ${emailAddress} and password: ${password}`);
    
    res.status(201).json({ success: true, data: newAdmin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Login admin
exports.loginAdmin = async (req, res) => {
  const { emailAddress, password } = req.body;

  try {
    const admin = await Admin.findOne({ emailAddress });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(admin);
    res.status(200).json({ success: true, token, admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch all admins with pagination
exports.getAllAdmins = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const admins = await Admin.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();
    const totalAdmins = await Admin.countDocuments();

    res.status(200).json({ success: true, admins, totalPages: Math.ceil(totalAdmins / limit) });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Fetch a single admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ success: false, message: 'Admin not found' });
    res.status(200).json({ success: true, data: admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Edit an admin account
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedAdmin) return res.status(404).json({ success: false, message: 'Admin not found' });

    res.status(200).json({ success: true, data: updatedAdmin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an admin account
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ success: false, message: 'Admin not found' });

    res.status(200).json({ success: true, message: 'Admin account deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Forgot password (send reset link)
exports.forgotPassword = async (req, res) => {
  // Implementation for forgot password (generate token, send email, etc.)
  res.status(200).json({ success: true, message: 'Forgot password functionality not implemented yet' });
};
