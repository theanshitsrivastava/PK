const express = require('express');
const { getParkingSlots, addParkingSlot } = require('../controllers/parkingController');

const router = express.Router();

// Routes
router.get('/slots', getParkingSlots); // Get parking slots
router.post('/slots', addParkingSlot); // Add a parking slot (testing)



module.exports = router;
