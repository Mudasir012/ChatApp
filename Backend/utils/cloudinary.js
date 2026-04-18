const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadImage(imageData) {
  return cloudinary.uploader.upload(imageData, {
    folder: "chatapp/users",
    resource_type: "image",
  });
}

module.exports = { uploadImage };
