const multer = require('multer');
const path = require('path');
const AWS = require('aws-sdk');
const { storage } = require('../config/firebase');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

// Configure multer for file uploads
const storage_local = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images and videos only
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and video files are allowed!'), false);
  }
};

// Initialize multer
const upload = multer({
  storage: storage_local,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

/**
 * Upload file to S3
 * @param {Object} file - The file object from multer
 * @param {String} folder - The folder to upload to (e.g., 'videos', 'thumbnails')
 * @returns {Promise<String>} - The URL of the uploaded file
 */
const uploadToS3 = async (file, folder) => {
  try {
    const fileContent = fs.readFileSync(file.path);
    
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${folder}/${uuidv4()}${path.extname(file.originalname)}`,
      Body: fileContent,
      ContentType: file.mimetype
    };
    
    const uploadResult = await s3.upload(params).promise();
    
    // Delete local file after upload
    fs.unlinkSync(file.path);
    
    return uploadResult.Location;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
};

/**
 * Upload file to Firebase Storage
 * @param {Object} file - The file object from multer
 * @param {String} folder - The folder to upload to (e.g., 'videos', 'thumbnails')
 * @returns {Promise<String>} - The URL of the uploaded file
 */
const uploadToFirebase = async (file, folder) => {
  try {
    const fileContent = fs.readFileSync(file.path);
    const fileName = `${folder}/${uuidv4()}${path.extname(file.originalname)}`;
    const fileUpload = storage.file(fileName);
    
    await fileUpload.save(fileContent, {
      metadata: {
        contentType: file.mimetype
      }
    });
    
    // Make the file publicly accessible
    await fileUpload.makePublic();
    
    // Delete local file after upload
    fs.unlinkSync(file.path);
    
    // Get the public URL
    const publicUrl = `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${fileName}`;
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to Firebase Storage:', error);
    throw error;
  }
};

module.exports = {
  upload,
  uploadToS3,
  uploadToFirebase
}; 