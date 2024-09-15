const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  emailAddress: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  profileImage: { type: String },
  userName: { type: String, required: true, unique: true },
  address: { type: String },
  city: { type: String },
  country: { type: String },
  nextOfKin: {
    fullName: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    address: { type: String },
  },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
}, { timestamps: true });

// Password hashing before saving the admin account
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
