import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Handle image upload and OCR processing
app.post('/upload', upload.single('image'), (req, res) => {
    const imagePath = req.file.path;

    Tesseract.recognize(imagePath, 'eng')
        .then(({ data: { text } }) => {
            res.json({ text });
        })
        .catch((error) => {
            console.error('OCR Error:', error);
            res.status(500).json({ error: 'Failed to process image' });
        });
});

// Serve static files from the Vue app
app.use(express.static(path.join(__dirname, '../ocr-web-app/dist')));

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
