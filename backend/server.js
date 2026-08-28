const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Routes
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
});
