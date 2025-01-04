const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

// configuring cloud storage - 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "studentVault", // Folder in Cloudinary
    allowed_formats: ["jpeg", "jpg", "png", "pdf"], // Allow PDF uploads
    resource_type: "auto", // Automatically detect file type
    access_type: "public", // Ensure the file is publicly accessible
  },
});

module.exports = {
    storage,cloudinary
}