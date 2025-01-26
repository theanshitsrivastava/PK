const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  availableSpaces: { type: Number, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  pricePerHour: { type: Number, required: true },
});

const addSlotModel = mongoose.model('addSlotModel', parkingSlotSchema);
module.exports = addSlotModel;
