const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {latitude:{type:String},longitude:{type:String}, },
  availableSpaces: { type: Number, required: true },
  coordinates: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  occupiedSpace:{type:Array},
  pricePerHour: { type: Number, required: true },
});

const addSlotModel = mongoose.model('addSlotModel', parkingSlotSchema);
module.exports = addSlotModel;
