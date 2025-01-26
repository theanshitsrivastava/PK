const express = require('express');
const { addParkingSlot, getAllSlots, deleteParkingSlot } = require('../controllers/addSlotController');
const { bookSlot } = require('../controllers/bookSlotController');

const router = express.Router();

// Routes
router.post('/addSlot', addParkingSlot); // Add a new slot
router.get('/getSlots', getAllSlots); // Get all slots
router.delete('/deleteSlot/:id', deleteParkingSlot); // Delete a slot by ID
router.post('/bookSlot', bookSlot); // book slot

module.exports = router;
