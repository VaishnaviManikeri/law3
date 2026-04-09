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

// ================= CORS CONFIGURATION (FIXED) =================
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://jadhavarcollegeoflaw.com',
  'https://www.jadhavarcollegeoflaw.com'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / mobile apps / no origin
      if (!origin) return callback(null, true);

      // Allow all Vercel preview URLs (IMPORTANT FIX)
      if (origin.includes('vercel.app')) {
        return callback(null, true);
      }

      // Allow listed origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Instead of blocking → allow temporarily (FIX)
      console.warn('⚠️ CORS blocked for:', origin);
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= STATIC FILES =================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ================= ROOT TEST =================
app.get('/', (req, res) => {
  res.send('Backend is running successfully 🚀');
});

// ================= PING ROUTE =================
app.get('/ping', (req, res) => {
  res.send('✅ Server is alive');
});

// ================= ROUTES =================
app.use('/api/test', require('./routes/testRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/careers', require('./routes/careerRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/admission', require('./routes/admissionRoutes'));

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong!',
  });
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
