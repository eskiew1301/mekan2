const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const HttpError = require("./models/http-errors");
const mongoose = require("mongoose");

const projectRoutes = require("./routes/projects.routes");
const userRoutes = require("./routes/users.routes");
const galleryRoutes = require("./routes/gallery.routes");
const documentRoutes = require("./routes/document.routes");
const mailRoutes = require("./routes/contactUs.routes");

const app = express();

// Updated CORS configuration
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:5173", // Development frontend
    "https://mekanplc.netlify.app", // Production frontend
  ];

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin); // Dynamically set allowed origin
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle OPTIONS preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

// Body parser
app.use(bodyParser.json());

// Static file serving
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use("/uploads/files", express.static(path.join("uploads", "files")));
app.use(
  "/api/library/image-gallery/uploads/images",
  express.static(path.join("uploads", "images"))
);

// Route handlers
app.use("/api/projects", projectRoutes);
app.use("/api/users", userRoutes);
app.use("/api/library/image-gallery", galleryRoutes);
app.use("/api/library/document-gallery", documentRoutes);
app.use("/api/contact-us", mailRoutes);

// 404 route handler
app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || "An unknown error occurred" });
});

// Database connection
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0zksl.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log(err));
