const express = require('express');
const axios = require('axios');
const parkingController = require('../controllers/parkingController');

const router = express.Router();

// API to fetch available parking slots
router.get('/slots', parkingController.getParkingSlots);

// API to book a parking slot
router.post('/book', parkingController.bookParkingSlot);

module.exports = router;
