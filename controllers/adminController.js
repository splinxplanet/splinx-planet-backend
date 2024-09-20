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

    // Function to generate the staffId in the format SP-0001
    const generateStaffId = async () => {
      let isUnique = false;
      let staffId;
      
      while (!isUnique) {
        // Generate random 4-digit number
        const randomDigits = Math.floor(1000 + Math.random() * 9000); // Ensures a 4-digit number
        
        // Create the staffId in the format SP-#### (e.g., SP-1234)
        staffId = `SP-${randomDigits}`;

        // Check if this staffId is unique in the database
        const existingAdmin = await Admin.findOne({ where: { staffId } });
        if (!existingAdmin) {
          isUnique = true;
        }
      }

      return staffId;
    };

    // Generate the unique staffId
    const staffId = await generateStaffId();
    console.log("Staff id", staffId)

    // Create a new admin with the generated staffId
    const newAdmin = await Admin.create({
      firstName,
      lastName,
      emailAddress,
      password,
      phoneNumber,
      userName,
      staffId, // Store the generated staffId
      ...rest,
    });

    // Send email with login details
    await sendEmail(
      emailAddress,
      'Admin Account Created',
      `Your account has been created. Login with username: ${emailAddress} and password: ${password}`
    );

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

exports.forgotPassword = async (req, res) => {
    const { emailAddress, newPassword } = req.body;

  if (!emailAddress || !newPassword) {
    return res.status(400).json({ message: "Old email address and new password are required." });
  }

  try {
    const user = await Admin.findOne({ emailAddress });
    if (!user) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // check if email matches user email
    if (emailAddress !== user.emailAddress) {
      return res.status(400).json({ message: "Email address doesn't exist" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
