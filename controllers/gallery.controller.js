const HttpError = require("../models/http-errors");
const Gallery = require("../models/gallery.model");

const addImage = async (req, res, next) => {
  try {
    const photos = req.files;
    if (!photos || photos.length === 0) {
      return next(new HttpError("No files uploaded.", 400));
    }

    const photoPaths = photos.map((file) => `/uploads/images/${file.filename}`);

    const newGallery = new Gallery({
      photos: photoPaths,
    });

    await newGallery.save();

    res.status(200).json({
      message: "Images uploaded successfully",
      photos: photoPaths,
    });
  } catch (err) {
    console.error("Error uploading images:", err);
    return next(new HttpError("File upload failed.", 500));
  }
};

const getImages = async (req, res, next) => {
  let galleries;
  try {
    galleries = await Gallery.find();
  } catch (err) {
    const error = new HttpError(
      "Fetching images failed, please try again later.",
      500
    );
    return next(error);
  }

  const transformedGalleries = galleries.map((gallery) => {
    return {
      ...gallery.toObject({ getters: true }),
      photos: gallery.photos.map((path) => {
        const formattedPath = path.replace(/\\/g, "/");
        const fullPath = `${process.env.IMAGE_PATH}${formattedPath}`;
        return fullPath;
      }),
    };
  });

  res.json({ galleries: transformedGalleries });
};

module.exports = { addImage, getImages };
