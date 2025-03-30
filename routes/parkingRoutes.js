const express = require('express');
const { getAllSlots, addParkingSlot } = require('../controllers/addSlotController');
const {autoBook, leaveSlot,getUserBookings} = require('../controllers/bookSlotController');

const router = express.Router();

// Routes
router.get('/slots', getAllSlots); // Get parking slots
router.post('/slots', addParkingSlot); // Add a parking slot (testing)
router.post('/autoBooking',autoBook);
router.get('/getAll',getUserBookings);
router.delete('/vacantSpace',leaveSlot);
module.exports = router;
