const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const attendanceRoutes = require('./routes/attendance');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5500', // Adjust port if needed based on frontend
  credentials: true
}));
app.use(express.json());

// Session setup
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: true
}));

// Routes
app.use('/api', authRoutes);
app.use('/api/attendance', attendanceRoutes);

// Server start
const PORT = 3000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
