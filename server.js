const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Define the base directory for images
const BASE_DIR = path.join(__dirname, '../QRattendanceSystem-main/.jmix/work/filestorage');

// Function to get all image files recursively
function getAllImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllImages(filePath, fileList);
    } else if (/\.(jpg|png|webp)$/i.test(file)) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

// Endpoint to serve a list of all available images
app.get('/images', (req, res) => {
  try {
    const allImages = getAllImages(BASE_DIR);
    const imageUrls = allImages.map((filePath) => {
      const relativePath = path.relative(BASE_DIR, filePath).replace(/\\/g, '/');
      return `http://localhost:${PORT}/images/${relativePath}`;
    });

    console.log("Serving image URLs:", imageUrls);
    res.json(imageUrls);
  } catch (error) {
    console.error("Error reading image directory:", error);
    res.status(500).send("Unable to fetch images");
  }
});

// Serve individual images by their relative path
app.use('/images', (req, res) => {
  const filePath = path.join(BASE_DIR, req.path);
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Image not found");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
