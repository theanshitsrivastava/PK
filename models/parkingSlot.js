const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  availableSpaces: { type: Number, required: true },
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
module.exports = ParkingSlot;
