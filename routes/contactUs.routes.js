const express = require("express");

const mailController = require('../controllers/mail.controller')
const router = express.Router();



router.post("/", mailController.sendEmail);


module.exports = router;