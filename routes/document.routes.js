const express = require("express");

const uploadFile =require('../middleware/uploadFiles')
const documentController = require('../controllers/document.controller')
const checkAuth=require('../middleware/check-auth')
const router = express.Router();

router.get("/", documentController.getFile);
// router.use(checkAuth)
router.post("/new", uploadFile.single('document'),documentController.addFile);


module.exports = router;
