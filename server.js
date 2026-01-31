const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// ================= LOAD ENV VARIABLES =================
dotenv.config();

// ================= CONNECT DATABASE =================
connectDB();

const app = express();

// ================= CORS CONFIG =================
app.use(
  cors({
    origin: '*', // allow all (safe for now; restrict later)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: false,
  })
);

// ================= BODY PARSERS =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES (IMAGES) =================
// IMPORTANT: This allows access to uploaded blog images
// Example URL:
// https://your-backend.onrender.com/uploads/blogs/imagename.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= ROOT TEST ROUTE =================
// Required for Render health check
app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

// ================= API TEST ROUTE =================
app.use('/api/test', require('./routes/testRoutes'));

// ================= MAIN API ROUTES =================
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));

// ================= 404 HANDLER =================
app.use((req, res) => {
  res.status(404).json({
    error: 'API route not found',
    path: req.originalUrl,
  });
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err.stack);

  res.status(err.status || 500).json({
    error: 'Something went wrong!',
    message: err.message,
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
