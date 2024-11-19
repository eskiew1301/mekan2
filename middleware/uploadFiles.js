const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

// Ensure the 'uploads/files' directory exists
const ensureUploadsDirectoryExists = () => {
    const uploadDir = path.join(__dirname, "../uploads/files");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
};

// Call the function to ensure the directory exists
ensureUploadsDirectoryExists();

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads/files")); // Correct directory path
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        cb(null, `${uniqueSuffix}-${file.originalname}`); // Unique filename
    },
});

// File type validation (only PDF)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only PDF files are allowed."), false);
    }
};

// Initialize Multer
const uploadFile = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
    fileFilter: fileFilter,
});

module.exports = uploadFile;