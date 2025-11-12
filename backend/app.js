// app.js
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const admin = require("firebase-admin");
const serviceAccount = require("./meet-up-app-6b65c-firebase-adminsdk-6lyn2-226300e51e.json");
// const aws = require("aws-sdk");
// const multerS3 = require("multer-s3");

const app = express();

const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// aws.config.update({
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   accessKeyId: process.env.AWS_ACCESS_KEY,
//   region: "ap-south-1",
// });

// const s3 = new aws.S3();

// const upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: process.env.BUCKET_NAME,
//     metadata: function (req, file, cb) {
//       cb(null, { fieldName: file.fieldname });
//     },
//     key: function (req, file, cb) {
//       // cb(null, Date.now().toString())
//       cb(null, file.originalname);
//     },
//   }),
//   limits: { fileSize: 10 * 1024 * 1024 },
// });

// app.js — REPLACE the entire multer + s3 block

//////////////////////// new code 

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureLocalDir = () => {
  const dir = path.join(__dirname, 'uploads', 'files');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const uploadToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const ext = MIME_TYPE_MAP[mimetype];
    if (!ext) return reject(new Error('Invalid file type'));

    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'meetup-app/files',
        public_id: `${uuidv4()}`,
        format: ext,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({ url: result.secure_url, public_id: result.public_id });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

let storage;
if (process.env.NODE_ENV === 'production') {
  storage = multer.memoryStorage();
} else {
  ensureLocalDir();
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads', 'files')),
    filename: (req, file, cb) => {
      const ext = MIME_TYPE_MAP[file.mimetype] || path.extname(file.originalname).slice(1);
      cb(null, `${uuidv4()}.${ext}`);
    },
  });
}

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 },
  storage,
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    cb(isValid ? null : new Error('Invalid file type!'), isValid);
  },
});
///////////////////////////////// new code ends

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://meet-up-app-6b65c-default-rtdb.firebaseio.com",
});

const usersRoutes = require("./routes/user.route");
const blogsRoutes = require("./routes/blog.route");
const fileUploadRoutes = require("./routes/fileUpload.route");
const HttpError = require("./models/http-error");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use(bodyParser.json());

// After app.use(bodyParser.json());
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads/files', express.static(path.join(__dirname, 'uploads', 'files')));
}

app.use("/api/users", usersRoutes);
app.use("/api/files", fileUploadRoutes);
app.use("/api/blogs", blogsRoutes);

// app.post("/upload", upload.single("file"), async function (req, res, next) {
//   if (!req.file) {
//     return res.status(400).json({ error: "File upload failed" });
//   }

//   if (req.file && req.file.location) {
//     res.status(200).json({
//       success: 1,
//       file: {
//         url: req.file.location,
//       },
//     });
//   } else {
//     res
//       .status(400)
//       .json({ success: 0, error: "No file received or invalid file format." });
//   }
// });

// new upload
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "File upload failed" });
  }

  let fileUrl, publicId;

  if (process.env.NODE_ENV === 'production') {
    try {
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype);
      fileUrl = result.url;
      publicId = result.public_id;
    } catch (err) {
      return res.status(500).json({ error: "Cloudinary upload failed" });
    }
  } else {
    fileUrl = `/uploads/files/${req.file.filename}`;
  }

  res.status(200).json({
    success: 1,
    file: { url: fileUrl, public_id: publicId },
  });
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oveofxm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      autoIndex: false,
    }
  )
  .then(() => {
    console.log("connected");
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });
