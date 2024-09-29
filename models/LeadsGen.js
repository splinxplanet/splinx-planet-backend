const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
  source: { type: String, default: "website" },
  fullName: { type: String, required: true },
  emailAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Lead', leadSchema);
