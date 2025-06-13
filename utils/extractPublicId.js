const extractPublicId = (cloudinaryUrl) => {
    try {
      // Example URL: https://res.cloudinary.com/demo/image/upload/v1623428301/adverts/image123.jpg
      const parts = cloudinaryUrl.split('/');
      const fileName = parts[parts.length - 1];
      const [publicId] = fileName.split('.'); // remove .jpg, .png, etc.
      const folder = parts[parts.length - 2]; // e.g., 'adverts'
  
      return `${folder}/${publicId}`;
    } catch (error) {
      console.error('Failed to extract public ID from URL:', cloudinaryUrl);
      return null;
    }
  };
  
  module.exports = extractPublicId;
  