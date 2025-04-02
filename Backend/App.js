import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcrypt';
import fs from 'fs';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();

const app = express();
const port = 8081;

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000'];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // This requires specific origins (no wildcard)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

app.use(express.json());
// Ensure this comes BEFORE any routes that use sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    sameSite: 'lax',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  },
  name: 'zaoga.sid' // Custom session cookie name
}));

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

const activeSessions = new Map();

// Fixed logout endpoint
app.post('/logout', (req, res) => {
  // Remove from activeSessions
  if (req.session.userId) {
    activeSessions.delete(req.session.userId);
  }

  req.session.destroy(err => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).json({ error: 'Logout failed' });
    }
    
    res.clearCookie('connect.sid', {
      path: '/',
      httpOnly: true
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
  });
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Login failed' });
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.save();

    // Track active session
    activeSessions.set(user.id, {
      id: user.id,
      fullname: user.fullname,
      email: user.email,
      lastActivity: new Date().toISOString(),
      loginTime: new Date().toISOString()
    });

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email
      }
    });
  });
});

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
    

// Add active users endpoint
app.get('/api/active-users', (req, res) => {
  const activeUsers = Array.from(activeSessions.values()).map(user => ({
    ...user,
    status: isUserActive(user.lastActivity) ? 'active' : 'inactive'
  }));
  
  res.json(activeUsers);
});

// Helper function to determine active status
function isUserActive(lastActivity) {
  const FIFTEEN_MINUTES = 15 * 60 * 1000; // 15 minute threshold
  return Date.now() - new Date(lastActivity).getTime() < FIFTEEN_MINUTES;
}

// Middleware to update last activity
app.use((req, res, next) => {
  if (req.user) {
    const userData = activeSessions.get(req.user.id);
    if (userData) {
      activeSessions.set(req.user.id, {
        ...userData,
        lastActivity: new Date().toISOString()
      });
    }
  }
  next();
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

app.get('/users', (req, res) => {
  const sql = 'SELECT id, fullname, email FROM users'; // Don't select password!
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching users:', err.message); // Log the error message for clarity
      return res.status(500).json({ error: 'Failed to retrieve users' });
    }

    // Log the results for debugging
    console.log('Fetched users:', results);

    // Add default access level
    const usersWithAccess = results.map(user => ({
      ...user,
      access: 'user' // Default all to 'user' or implement real roles
    }));

    res.status(200).json(usersWithAccess);
  });
});
// Add this with your other routes
app.get('/users/count', (req, res) => {
  const sql = 'SELECT COUNT(*) AS count FROM users';
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to get user count',
        details: err.message 
      });
    }

    // Return the count as a number
    res.json({
      count: results[0]?.count || 0
    });
  });
});

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the Knowledge Base of ZAOGA HQ!');
});

// Add this with your other routes
app.get('/articles/topic-counts', (req, res) => {
  const sql = `
    SELECT 
      COALESCE(NULLIF(TRIM(topic), ''), 'Uncategorized') AS topic,
      COUNT(*) AS count
    FROM zaoga_kb.articles
    GROUP BY topic
    ORDER BY count DESC
    LIMIT 10
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to get topic counts',
        details: err.message 
      });
    }

    // Format the results
    const formattedResults = results.map(item => ({
      topic: item.topic || 'Uncategorized',
      count: Number(item.count) || 0
    }));

    res.json(formattedResults);
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

// Add this endpoint to your existing backend (server.js/app.js)
app.get('/articles/topics-per-day', (req, res) => {
  // SQL query to count topics by day
  const sql = `
    SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS topic_count
    FROM zaoga_kb.articles
    WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        error: 'Failed to get topics per day',
        details: err.message 
      });
    }

    // Format dates and ensure consistent data points for all days
    const formattedResults = fillMissingDates(results);
    
    res.json(formattedResults);
  });
});

// Helper function to ensure all dates are represented
function fillMissingDates(data) {
  const results = [];
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Create a map of existing data points
  const dataMap = {};
  data.forEach(item => {
    dataMap[item.date.toISOString().split('T')[0]] = item.topic_count;
  });

  // Fill in missing dates with 0 counts
  for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    results.push({
      date: dateStr,
      topic_count: dataMap[dateStr] || 0
    });
  }

  return results;
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});