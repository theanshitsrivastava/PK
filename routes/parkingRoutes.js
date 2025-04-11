const express = require("express");
const router = express.Router();
const ParkingArea = require("../models/addSlotModel");
const Booking = require("../models/bookingModel");

// Auto Booking
router.post("/autoBooking", async (req, res) => {
  try {
    const { vehicleNumber, parkingAreaId } = req.body;

    const area = await ParkingArea.findById(parkingAreaId);
    if (!area) return res.status(404).json({ message: "Parking area not found" });

    if (area.occupiedSpace.length >= area.availableSpaces)
      return res.status(400).json({ message: "No slots available" });

    // Assign lowest unoccupied slot
    let assignedSlot = null;
    for (let i = 1; i <= area.availableSpaces; i++) {
      if (!area.occupiedSpace.includes(i)) {
        assignedSlot = i;
        break;
      }
    }

    // Create booking
    const booking = await Booking.create({
      vehicleNumber,
      location: parkingAreaId,
      slot: assignedSlot,
      entryTime: new Date()
    });

    area.occupiedSpace.push(assignedSlot);
    await area.save();

    res.status(200).json({
      message: "Slot booked",
      slot: assignedSlot,
      bookingId: booking._id
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Auto Leave
router.post("/autoLeave", async (req, res) => {
  try {
    const { parkingAreaId, slot, state } = req.body;

    const area = await ParkingArea.findById(parkingAreaId);
    if (!area) return res.status(404).json({ message: "Parking area not found" });

    if (state === "vacant") {
      // Get latest booking for that slot
      const booking = await Booking.findOne({ location: parkingAreaId, slot }).sort({ entryTime: -1 });
      if (!booking) return res.status(404).json({ message: "Booking not found" });

      const exitTime = new Date();
      const durationMs = exitTime - booking.entryTime;
      const durationHrs = Math.ceil(durationMs / (1000 * 60 * 60));
      const amount = durationHrs * area.pricePerHour;

      // Update booking
      booking.exitTime = exitTime;
      booking.paymentStatus = true;
      booking.amount = amount;
      await booking.save();

      // Remove from occupiedSpace
      area.occupiedSpace = area.occupiedSpace.filter(s => s !== slot);
      await area.save();

      res.status(200).json({
        message: "Slot vacated",
        amount,
        durationHrs,
        exitTime
      });
    } else {
      res.status(200).json({ message: "Slot still occupied. No update made." });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// 1️⃣ Get all parking slots (areas)
router.get("/all", async (req, res) => {
    try {
      const slots = await ParkingArea.find();
      res.status(200).json(slots);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // 2️⃣ Get specific parking area by ID
  router.get("/:id", async (req, res) => {
    try {
      const area = await ParkingArea.findById(req.params.id);
      if (!area) return res.status(404).json({ message: "Parking area not found" });
      res.status(200).json(area);
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
  // 3️⃣ Get nearest slots within X km of given lat/lng
  router.get("/nearest", async (req, res) => {
    try {
      const { lat, lng, radius = 5 } = req.query;
  
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }
  
      const latitude = parseFloat(lat);
      const longitude = parseFloat(lng);
      const radiusInKm = parseFloat(radius);
  
      const earthRadiusKm = 6371;
  
      // Using the Haversine Formula
      const toRad = (value) => (value * Math.PI) / 180;
  
      const nearbyAreas = await ParkingArea.find();
  
      const filtered = nearbyAreas.filter(area => {
        const dLat = toRad(area.coordinates.latitude - latitude);
        const dLon = toRad(area.coordinates.longitude - longitude);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(latitude)) * Math.cos(toRad(area.coordinates.latitude)) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c;
        return distance <= radiusInKm;
      });
  
      res.status(200).json({ results: filtered, total: filtered.length });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  });
  
module.exports = router;
