const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: ProcessingInstruction.env.CLOUDINARY_USER_NAME,
    api_key: ProcessingInstruction.env.CLOUDINARY_API_KEY,
    api_secret: process_env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;