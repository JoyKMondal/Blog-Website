// routes\fileUpload.route.js
const express = require("express");
const fileUploadControllers = require("../controllers/fileUpload.controller");

const router = express.Router();

router.get("/list", fileUploadControllers.getAllFile);

router.get("/download/:filename", fileUploadControllers.downloadFile);

router.delete("/delete/:filename", fileUploadControllers.deleteFile);

module.exports = router;
