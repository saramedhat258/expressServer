const express = require('express');
const multer = require('multer');
const axios = require('axios');
const path = require('path');
const fs = require('fs');
const cors = require('cors');  // Import the cors middleware

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Enable CORS for all routes
app.use(express.json());

app.post('/products', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const productData = JSON.parse(req.body.productData); // Assuming `productData` is sent as a JSON string

        console.log('Received product data:', productData);
        console.log('Received file:', file);

        if (file) {
            const targetPath = path.join(__dirname, 'uploads', file.originalname);
            fs.renameSync(file.path, targetPath);
            productData.image = `http://localhost:3001/uploads/${file.originalname}`;
        }

        // Forward the data to JSON Server
        const response = await axios.post('http://localhost:9000/products', productData);
        res.status(response.status).json(response.data);
    } catch (error) {
        console.error("Error uploading file or forwarding data:", error);
        res.status(500).json({ error: error.message });
    }
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(3001, () => {
    console.log('Express server is running on port 3001');
});