// // controllers\fileUpload.controller.js

// const aws = require("aws-sdk");

// aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   region: "ap-south-1",
// });

// const BUCKET_NAME = process.env.BUCKET_NAME;
// const s3 = new aws.S3();

// const getAllFile = async (req, res, next) => {
//   try {
//     let r = await s3.listObjectsV2({ Bucket: BUCKET_NAME }).promise();
//     let x = r.Contents.map((item) => item.Key);
//     res.send(x);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// const downloadFile = async (req, res, next) => {
//   const filename = req.params.filename;
//   try {
//     let x = await s3
//       .getObject({ Bucket: BUCKET_NAME, Key: filename })
//       .promise();
//     res.send(x.Body);
//   } catch (error) {
//     console.error(error);
//     res.status(404).send("File Not Found");
//   }
// };

// const deleteFile = async (req, res, next) => {
//   const filename = req.params.filename;
//   try {
//     await s3.deleteObject({ Bucket: BUCKET_NAME, Key: filename }).promise();
//     res.send("File Deleted Successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };

// exports.getAllFile = getAllFile;
// exports.downloadFile = downloadFile;
// exports.deleteFile = deleteFile;


// controllers/fileUpload.controller.js
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

const getAllFile = async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    try {
      const result = await cloudinary.api.resources({
        resource_type: 'upload',
        prefix: 'meetup-app/files/',
        max_results: 100,
      });
      const files = result.resources.map(f => ({
        public_id: f.public_id,
        url: f.secure_url,
        format: f.format,
      }));
      res.json(files);
    } catch (err) {
      res.status(500).send("Failed to list files");
    }
  } else {
    const dir = path.join(__dirname, '..', 'uploads', 'files');
    fs.readdir(dir, (err, files) => {
      if (err) return res.status(500).send("Error reading directory");
      res.json(files.map(f => ({ url: `/uploads/files/${f}` })));
    });
  }
};

const downloadFile = async (req, res) => {
  const filename = req.params.filename;
  if (process.env.NODE_ENV === 'production') {
    res.redirect(cloudinary.url(filename, { secure: true }));
  } else {
    const filePath = path.join(__dirname, '..', 'uploads', 'files', filename);
    res.download(filePath);
  }
};

const deleteFile = async (req, res) => {
  const filename = req.params.filename;
  if (process.env.NODE_ENV === 'production') {
    try {
      await cloudinary.uploader.destroy(filename);
      res.send("File Deleted Successfully");
    } catch (err) {
      res.status(500).send("Failed to delete");
    }
  } else {
    const filePath = path.join(__dirname, '..', 'uploads', 'files', filename);
    fs.unlink(filePath, () => res.send("File Deleted"));
  }
};

exports.getAllFile = getAllFile;
exports.downloadFile = downloadFile;
exports.deleteFile = deleteFile;
