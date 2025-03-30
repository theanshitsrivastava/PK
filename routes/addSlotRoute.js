const express = require('express');
const { addParkingSlot, getAllSlots, deleteParkingSlot, insertDummyData } = require('../controllers/addSlotController');
const autoBook = require('../controllers/bookSlotController');

const addSlotRoute = express.Router();

// Routes
addSlotRoute.post('/addSlot', addParkingSlot); // Add a new slot
addSlotRoute.get('/getSlots', getAllSlots); // Get all slots
addSlotRoute.delete('/deleteSlot/:id', deleteParkingSlot); // Delete a slot by ID
addSlotRoute.post('/insertDummyData', insertDummyData); // Insert dummy data for testing

module.exports = addSlotRoute;
