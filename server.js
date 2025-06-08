// server.js
const express = require('express');
const mongoose = require('./models/user.js'); 
const app = express();
const port = 5000;
const connectDB = require('./config/db.js');
// Import parking routes
const router = require('./routes/parkingRoutes.js');
const addSlotRoute = require('./routes/addSlotRoute.js');
connectDB();

// const user = new mongoose({'username':'anshit','email':'anshitsrivastav@gmail.com','password':'ansh123'});
// user.save();

// Middleware to parse JSON requests
app.use(express.json());
//


// Use parking routes
app.use('/api/parking', router);
app.use('/api/admin', addSlotRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
