const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    recipients: [{ type: String, required: true }], // array to store multiple recipients
    recipientsCount: {type: Number, default: 0},
    html: { type: String, required: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: String, default: "Super_Admin"},
    sentAt: { type: Date }
});

const Email = mongoose.model('Email', emailSchema);

module.exports = Email;
