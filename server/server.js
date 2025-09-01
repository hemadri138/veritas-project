const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const db = require('./config/db');

// Import routes
const userRoutes = require('./routes/users');
const claimRoutes = require('./routes/claims');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Basic root route
app.get('/', (req, res) => {
  res.json({ message: 'Veritas API is running' });
});

// API routes
app.use('/api/users', userRoutes);
app.use('/api/claims', claimRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
});
