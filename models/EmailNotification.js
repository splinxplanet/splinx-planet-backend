const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    recipients: [{ type: String, required: true }], // array to store multiple recipients
    html: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    sentAt: { type: Date }
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
