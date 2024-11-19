const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

// Ensure the 'uploads/images' directory exists
const ensureUploadsDirectoryExists = () => {
  const uploadDir = path.join(__dirname, '../uploads/images');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
};

// Call the function to ensure the directory is created
ensureUploadsDirectoryExists();

const fileUpload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/images'); // Specify the directory where the file will be saved
    },
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype];
      cb(null, uuidv4() + "." + ext); // Generate a unique filename for the uploaded file
    },
  }),
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype]; // Validate mime type
    let error = isValid ? null : new Error("Invalid mime type. Only jpg, jpeg, and png are allowed.");
    cb(error, isValid);
  },
});

module.exports = fileUpload;
