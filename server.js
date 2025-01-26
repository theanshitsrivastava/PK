// server.js
const express = require('express');
const connectDB = require('./Services/supabase.js');
const mongoose = require('./models/user.js'); 
const app = express();
const port = 5000;

// Import parking routes
const parkingRoutes = require('./routes/parkingRoutes');
await connectDB();

const user = new mongoose({'username':'anshit','email':'anshitsrivastav@gmail.com','password':'ansh123'});
user.save();

// Middleware to parse JSON requests
app.use(express.json());
//


// Use parking routes
app.use('/api/parking', parkingRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
