const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  location: { type: mongoose.Types.ObjectId, required: true },
  slot:{type: Number},
  paymentStatus:{type:Boolean,default:false},
  amount:{type:Number},
  entryTime:{type:Date},
  exitTime:{type:Date},
});

const ParkingSlot = mongoose.model('ParkingSlot', parkingSlotSchema);
module.exports = ParkingSlot;
