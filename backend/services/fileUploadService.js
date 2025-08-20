import cloudinary from 'cloudinary';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file to Cloudinary
const uploadToCloudinary = async (file, folder) => {
  try {
    // Convert buffer to base64
    const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    
    // Generate a unique filename
    const filename = `${uuidv4()}-${file.originalname}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileStr, {
      folder,
      public_id: filename,
      resource_type: 'auto' // Auto-detect file type
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('File upload failed');
  }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export { upload, uploadToCloudinary, deleteFromCloudinary };
