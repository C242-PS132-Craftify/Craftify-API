// routes/upload.js
const express = require("express");
const multer = require("multer");
const { uploadImage } = require("../controllers/uploadController");
const router = express.Router();

// Set up file storage dan limit
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Definisikan route upload
router.post("/", upload.single("image"), uploadImage);

module.exports = router; // Menggunakan ekspor yang benar
