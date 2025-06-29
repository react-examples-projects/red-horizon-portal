
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  secure: true,
  cloud_name: process.env.CLOUDINAY_NAME,
  api_key: process.env.CLOUDINAY_API_KEY,
  api_secret: process.env.CLOUDINAY_API_SECRET,
});

module.exports = cloudinary;
