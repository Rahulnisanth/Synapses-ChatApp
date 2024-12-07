import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper function to upload to cloudinary
export const uploadToCloudinary = async (file, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};

// Helper function to delete from cloudinary
export const deleteFromCloudinary = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};

// Generate a signed URL for private/authenticated files
export const generateSignedUrl = (publicId, resourceType = "raw") => {
  const options = {
    resource_type: resourceType, // 'image' for images, 'raw' for other files like PDFs
    type: "authenticated", // Use 'private' if your files are private
    sign_url: true,
  };

  const signedUrl = cloudinary.url(publicId, options);
  return signedUrl;
};
