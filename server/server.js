const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const atpRoutes = require('./routes/atpRoutes');

// Load environment variables from server/.env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Middleware
app.use(
  cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Health Check & System Status
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    system: 'ATP Score Management System Backend',
    databaseConnected: getDBStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Mount ATP Score REST API
app.use('/api/atp', atpRoutes);

// 404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 ATP Score Backend Server is active on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/atp`);
  console.log(`💚 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`======================================================\n`);
});
