const Email = require('../models/EmailNotification');
const sendEmail = require('../utils/sendEmail'); // Function to send email

// Send new email to single or multiple recipients
exports.sendEmailNotification = async (req, res) => {
    try {
        const { subject, recipients, html } = req.body;

        // Create email entry in the database
        const email = new Email({
            subject,
            recipients,
            html,
            status: 'pending'
        });

        await email.save();

        // Send email to each recipient
        const result = await Promise.all(recipients.map(recipient => sendEmail(recipient, subject, html)));

        // Update the email status after sending
        email.status = 'sent';
        email.sentAt = Date.now();
        await email.save();

        res.status(201).json({ success: true, message: 'Email sent successfully', data: email });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};

// Resend email by ID
exports.resendEmail = async (req, res) => {
    try {
        const email = await Email.findById(req.params.id);

        if (!email) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        // Resend email to recipients
        await Promise.all(email.recipients.map(recipient => sendEmail(recipient, email.subject, email.html)));

        // Update email status
        email.status = 'sent';
        email.sentAt = Date.now();
        await email.save();

        res.status(200).json({ success: true, message: 'Email resent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to resend email' });
    }
};

// Delete email by ID
exports.deleteEmail = async (req, res) => {
    try {
        const email = await Email.findByIdAndDelete(req.params.id);

        if (!email) {
            return res.status(404).json({ success: false, message: 'Email not found' });
        }

        res.status(200).json({ success: true, message: 'Email deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete email' });
    }
};

// Fetch all emails
exports.getAllEmails = async (req, res) => {
    try {
        const emails = await Email.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: emails });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch emails' });
    }
};

// Search emails by subject
exports.searchEmails = async (req, res) => {
    try {
        const { query } = req.params;
        const emails = await Email.find({ subject: new RegExp(query, 'i') });

        res.status(200).json({ success: true, data: emails });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to search emails' });
    }
};
