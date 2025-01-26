// app.js
const express = require('express');
const connectDB = require('./config/db');
const parkingRoutes = require('./routes/parkingRoutes');

const app = express();

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();

// Routes
app.use('/api/parking', parkingRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
