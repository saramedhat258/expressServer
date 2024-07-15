const express = require("express");
const multer = require("multer");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(cors());
app.use(express.json());

// URL of your deployed JSON Server
const JSON_SERVER_URL = 'https://vivacious-gentle-divan.glitch.me/';

app.post("/products", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const productData = JSON.parse(req.body.productData);

    console.log("Received product data:", productData);
    console.log("Received file:", file);

    if (file) {
      const targetPath = path.join(__dirname, "uploads", file.originalname);
      fs.renameSync(file.path, targetPath);
      productData.image = `${req.protocol}://${req.get('host')}/uploads/${file.originalname}`;
    }
    // Forward the data to JSON Server
    const response = await axios.post(`${JSON_SERVER_URL}/products`, productData);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error("Error uploading file or forwarding data:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT || 3001, () => {
  console.log("Express server is running on port 3001");
});
