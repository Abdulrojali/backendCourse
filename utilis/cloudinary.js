const { v2:cloudinary } = require("cloudinary")
require("dotenv").config();
const fs=require('fs') 
cloudinary.config({
  cloud_name:process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
});

module.exports= {cloudinary};
// Utility helper
const cloudinaryUtils = {
  // Upload file (image/video)
  upload: async (filePath, folder = "uploads", resourceType = "auto") => {
    try {
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: resourceType, // bisa 'image', 'video', atau 'auto'
      });

      // Hapus file dari local setelah di-upload
      fs.unlinkSync(filePath);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        resource_type: result.resource_type,
      };
    } catch (error) {
      console.error("Upload Error:", error);
      throw new Error("Failed to upload to Cloudinary");
    }
  },

  // Update file di Cloudinary
  update: async (oldPublicId, newFilePath, folder = "uploads", resourceType = "auto") => {
    try {
      // Hapus file lama
      await cloudinary.uploader.destroy(oldPublicId, { resource_type: resourceType });

      // Upload file baru
      const result = await cloudinary.uploader.upload(newFilePath, {
        folder,
        resource_type: resourceType,
      });

      // Hapus file local
      fs.unlinkSync(newFilePath);

      return {
        url: result.secure_url,
        public_id: result.public_id,
      };
    } catch (error) {
      console.error("Update Error:", error);
      throw new Error("Failed to update file on Cloudinary");
    }
  },

  // Delete file dari Cloudinary
  delete: async (publicId, resourceType = "image") => {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return result;
    } catch (error) {
      console.error("Delete Error:", error);
      throw new Error("Failed to delete file from Cloudinary");
    }
  },
};

module.exports= cloudinaryUtils;
