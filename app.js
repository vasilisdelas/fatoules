require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// API endpoint to send Firebase config to the frontend
app.get("/api/firebase-config", (req, res) => {
  res.json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
  });
});

app.get("/api/common-password", (req, res) => {
  res.json({ password: process.env.COMMON_PASSWORD });
});

// Middleware to serve static files
app.use(express.static(path.join(__dirname, "./public")));

// Serve HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/upload.html"));
});

app.get("/gallery", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/gallery.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
