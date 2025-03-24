import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = 8081;

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
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
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('MySQL connected...');
});

// ===== ROUTES =====

// Signup route
app.post('/signup', async (req, res) => {
  console.log('Signup request body:', req.body); // Debugging log
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'INSERT INTO users (fullname, email, password) VALUES (?, ?, ?)';
    const values = [fullname, email, hashedPassword];

    db.query(sql, values, (err, results) => {
      if (err) {
        console.error('Error inserting user:', err);
        return res.status(500).json({ error: 'Failed to create user' });
      }

      res.status(201).json({ message: 'User created successfully', id: results.insertId });
    });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error logging in:', err);
      return res.status(500).json({ error: 'Login failed' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return user details on successful login
    res.status(200).json({
      message: 'Login successful',
      user: {
        fullname: user.fullname,
        email: user.email,
      },
    });
  });
});

// File upload route
app.post('/uploads', upload.single('file'), (req, res) => {
  if (req.file) {
    res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: `http://localhost:${port}/uploads/${req.file.filename}`,
    });
  } else {
    res.status(400).send('No file uploaded');
  }
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Knowledge Base of ZAOGA HQ!');
});

// Get all articles
app.get('/articles', (req, res) => {
  const sql = 'SELECT * FROM articles';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching articles:', err);
      return res.status(500).json({ error: 'Failed to retrieve articles' });
    }
    res.status(200).json(results);
  });
});

// Add a new article with FAQs
app.post('/articles', upload.single('file'), (req, res) => {
  const { topic, description, resolution, faqs } = req.body;
  const fileName = req.file ? req.file.originalname : null;
  const filePath = req.file ? req.file.path : null;
  const fileSize = req.file ? req.file.size : null;
  const fileType = req.file ? req.file.mimetype : null;

  const sql = 'INSERT INTO articles (topic, description, resolution, file_name, file_path, file_size, file_type) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [topic, description, resolution, fileName, filePath, fileSize, fileType];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting article:', err);
      return res.status(500).send('Server error');
    }

    const articleId = results.insertId;

    // Insert FAQs if provided
    if (faqs && faqs.length > 0) {
      const faqSql = 'INSERT INTO faqs (question, answer, article_id) VALUES ?';
      const faqValues = faqs.map((faq) => [faq.question, faq.answer || null, articleId]);

      db.query(faqSql, [faqValues], (err) => {
        if (err) {
          console.error('Error inserting FAQs:', err);
          return res.status(500).send('Server error');
        }
      });
    }

    res.status(200).json({ id: articleId });
  });
});

// Update an article
app.put('/articles/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const { topic, description, resolution, faqs } = req.body;
  const fileName = req.file ? req.file.originalname : null;
  const filePath = req.file ? req.file.path : null;
  const fileSize = req.file ? req.file.size : null;
  const fileType = req.file ? req.file.mimetype : null;

  const sql = 'UPDATE articles SET topic = ?, description = ?, resolution = ?, file_name = ?, file_path = ?, file_size = ?, file_type = ? WHERE id = ?';
  const values = [topic, description, resolution, fileName, filePath, fileSize, fileType, id];

  db.query(sql, values, (err) => {
    if (err) {
      console.error('Error updating article:', err);
      return res.status(500).json({ error: 'Update failed' });
    }

    res.status(200).json({ message: 'Article updated successfully' });
  });
});

// Get FAQs
app.get('/faqs', (req, res) => {
  const sql = `
    SELECT question FROM zaoga_kb.faqs
    GROUP BY question
    HAVING COUNT(question) > 2
    ORDER BY COUNT(question) DESC;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching aggregated FAQs:', err);
      return res.status(500).json({ error: 'Failed to retrieve FAQs' });
    }
    res.status(200).json(results); // Returns only questions with count > 2
  });
});

// Add a question to FAQs
app.post('/faqs', (req, res) => {
  console.log('Request received at /faqs'); // Log to verify the route is accessed
  console.log('Request body:', req.body); // Log the request body
  const { question, article_id } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required' });
  }

  const sql = 'INSERT INTO faqs (question, article_id) VALUES (?, ?)';
  const values = [question, article_id || null]; // If article_id is not provided, it will be null

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error inserting question into FAQs table:', err);
      return res.status(500).json({ error: 'Failed to add question to FAQs' });
    }
    res.status(201).json({ id: results.insertId, message: 'Question added successfully to FAQs' });
  });
});

// Search articles
app.post('/search', (req, res) => {
  const { question } = req.body;

  // Split the input sentence into words, normalize to lowercase, and remove empty strings
  const words = question
    .toLowerCase()
    .split(' ')
    .filter(word => word.trim() !== ''); // Filter out empty words

  if (words.length === 0) {
    return res.status(400).json({ error: 'No valid words found in the question.' });
  }

  // Construct dynamic SQL query with `LIKE` for each word
  const conditions = words.map(() => 'topic LIKE ? OR description LIKE ? OR resolution LIKE ?').join(' OR ');
  const values = words.flatMap(word => [`%${word}%`, `%${word}%`, `%${word}%`]);

  const sql = `SELECT * FROM articles WHERE ${conditions}`;

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error searching articles:', err);
      return res.status(500).json({ error: 'Server error while searching articles.' });
    }

    res.status(200).json(results); // Return the matching articles
  });
});

// Get user details
app.get('/user', (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const sql = 'SELECT fullname, email FROM users WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error('Error fetching user details:', err);
      return res.status(500).json({ error: 'Failed to fetch user details' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(results[0]);
  });
});
// Get article counts by topic
app.get('/articles', (req, res) => {
  const sql = `
SELECT topic  , COUNT(*) AS count FROM zaoga_kb.articles
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});