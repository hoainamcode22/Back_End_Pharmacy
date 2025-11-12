// Cloudinary Configuration
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dd1onmi19',
  api_key: process.env.CLOUDINARY_API_KEY || '697521727136735',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'U25GYEZbqBvbnFA8McAXtlamZVI'
});

// Test connection
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connected successfully:', result);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

module.exports = {
  cloudinary,
  testCloudinaryConnection
};
