import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3001 ; // You can change this to another port if needed

// Middleware
app.use(cors());
app.use(express.json());

const uploadDir = 'uploads/';

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  try {
    fs.mkdirSync(uploadDir);
  } catch (err) {
    console.error('Error creating upload directory:', err);
    process.exit(1);
  }
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Handinawangu2050',
  database: process.env.DB_NAME || 'zaoga_kb',
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.stack);
    return; // Do not throw the error
  }
  console.log('MySQL connected...');
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Knowledge Base of ZAOGA HQ!');
});

app.get('/articles', (req, res) => {
  const sql = `
    SELECT topic, COUNT(*) AS count
    FROM articles
    GROUP BY topic;
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching articles:', err.stack);
      res.status(500).send('Server error');
      return;
    }
    res.json(results);
  });
});

// Add a new article
app.post('/articles', (req, res) => {
  upload.fields([{ name: 'file' }, { name: 'image' }])(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send('File size exceeds the limit of 5MB');
      }
      console.error('Multer error:', err);
      return res.status(500).send('Server error');
    }

    const { topic, description, resolution } = req.body;

    if (!topic || !description || !resolution) {
      return res.status(400).send('Missing required fields');
    }

    const file_path = req.files['file'] ? req.files['file'][0].filename : null;
    const image_path = req.files['image'] ? req.files['image'][0].filename : null;

    const sql = 'INSERT INTO articles (topic, description, resolution, file_path, image_path) VALUES (?, ?, ?, ?, ?)';

    db.query(sql, [topic, description, resolution, file_path, image_path], (err, results) => {
      if (err) {
        console.error('Database error:', err.stack);
        return res.status(500).send('Server error');
      }
      res.status(200).json({ id: results.insertId });
    });
  });
});

app.post('/search', (req, res) => {
  const { question } = req.body;
  const sql = 'SELECT * FROM articles WHERE topic LIKE ? OR description LIKE ? OR resolution LIKE ?';
  const searchTerm = `%${question}%`;

  db.query(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error searching for articles:', err); // Log the error
      res.status(500).send('Server error');
      return;
    }
    res.status(200).json(results);
  });
});

// Start the server with error handling
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please use a different port.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1); // Exit the application
});