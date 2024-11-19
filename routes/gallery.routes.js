const express = require("express");

const uploadFile =require('../middleware/file-upload')
const galleryController = require('../controllers/gallery.controller')
const checkAuth=require('../middleware/check-auth')
const router = express.Router();

router.get("/", galleryController.getImages);
router.use(checkAuth)
router.post("/new", uploadFile.array('photos',5),galleryController.addImage);


module.exports = router;
