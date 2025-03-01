import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup
const upload = multer();

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Handinawangu2050',
  database: 'zaoga_kb'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL connected...');
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Knowledge Base of ZAOGA HQ !');
});

// Get all articles
app.get('/articles', (req, res) => {
  const sql = 'SELECT * FROM articles';
  db.query(sql, (err, results) => {
    if (err) {
      throw err;
    }
    res.json(results);
  });
});

// Update an article
app.put('/articles/:id', (req, res) => {
  const { id } = req.params;
  const { topic, description, resolution } = req.body;
  const sql = 'UPDATE articles SET topic = ?, description = ?, resolution = ? WHERE id = ?';
  db.query(sql, [topic, description, resolution, id], (err, results) => {
    if (err) {
      throw err;
    }
    res.json({ message: 'Article updated successfully' });
  });
});

// Add a new article
app.post('/articles', upload.none(), (req, res) => {
  const { topic, description, resolution } = req.body;
  console.log('Received data:', req.body); // Log the request body
  const sql = 'INSERT INTO articles (topic, description, resolution) VALUES (?, ?, ?)';
  db.query(sql, [topic, description, resolution], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err); // Log the error
      res.status(500).send('Server error');
      return;
    }
    res.status(200).json({ id: results.insertId });
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

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
