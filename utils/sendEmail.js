const nodemailer = require('nodemailer');

// Function to send an email
const sendEmail = async (email, subject, html) => {
    try {
        // Create a transporter using nodemailer
        const transporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'splinxplanent@gmail.com', // your email
                pass: process.env.EMAIL_PASSWORD, // your email password
            },
        });

        // Setup email data
        const mailOptions = {
            from: '"SplinX Planet" <support@splinxplanet.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line
            html: html, // html body
        };

        // Send email
        let info = await transporter.sendMail(mailOptions);

        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email: ', error);
        throw new Error('Failed to send email');
    }
};

module.exports = sendEmail;
