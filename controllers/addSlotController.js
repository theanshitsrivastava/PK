const mongoose = require('mongoose');
const addSlotModel = require('../models/addSlotModel');

// ✅ Add a new parking slot
exports.addParkingSlot = async (req, res) => {
  try {
    const { name, location, availableSpaces, latitude, longitude, pricePerHour } = req.body;

    // Validate required fields
    if (!name || !location || !availableSpaces || !latitude || !longitude || !pricePerHour) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newSlot = new addSlotModel({
      name,
      location,
      availableSpaces,
      coordinates: { latitude, longitude },
      pricePerHour,
    });

    await newSlot.save();
    res.status(201).json({ message: "Parking slot added successfully", slot: newSlot });
  } catch (err) {
    console.error("Error adding parking slot:", err);
    res.status(500).json({ message: "Failed to add parking slot", error: err.message });
  }
};

// ✅ Get all parking slots (with optional location filtering)
exports.getAllSlots = async (req, res) => {
  try {
    const { location } = req.query;

    // Filter by location if provided
    const filter = location ? { "location.latitude": location } : {};

    const slots = await addSlotModel.find(filter);
    if (slots.length === 0) {
      return res.status(404).json({ message: "No parking slots found." });
    }

    res.status(200).json(slots);
  } catch (err) {
    console.error("Error fetching parking slots:", err);
    res.status(500).json({ message: "Failed to fetch parking slots", error: err.message });
  }
};

// ✅ Delete a parking slot by ID
exports.deleteParkingSlot = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSlot = await addSlotModel.findByIdAndDelete(id);
    if (!deletedSlot) {
      return res.status(404).json({ message: "Parking slot not found." });
    }

    res.status(200).json({ message: "Parking slot deleted successfully", slot: deletedSlot });
  } catch (err) {
    console.error("Error deleting parking slot:", err);
    res.status(500).json({ message: "Failed to delete parking slot", error: err.message });
  }
};

// ✅ Insert Dummy Data
exports.insertDummyData = async (req, res) => {
  try {
    const parkingAreas = [
      {
        name: "Downtown Parking",
        location: { latitude: "40.7128", longitude: "-74.0060" },
        availableSpaces: 50,
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        pricePerHour: 5.0,
      },
      {
        name: "City Center Lot",
        location: { latitude: "34.0522", longitude: "-118.2437" },
        availableSpaces: 30,
        coordinates: { latitude: 34.0522, longitude: -118.2437 },
        pricePerHour: 7.5,
      },
      {
        name: "Mall Parking",
        location: { latitude: "51.5074", longitude: "-0.1278" },
        availableSpaces: 100,
        coordinates: { latitude: 51.5074, longitude: -0.1278 },
        pricePerHour: 3.0,
      },
      {
        name: "Airport Parking",
        location: { latitude: "37.7749", longitude: "-122.4194" },
        availableSpaces: 200,
        coordinates: { latitude: 37.7749, longitude: -122.4194 },
        pricePerHour: 10.0,
      },
      {
        name: "Hotel Parking",
        location: { latitude: "48.8566", longitude: "2.3522" },
        availableSpaces: 20,
        coordinates: { latitude: 48.8566, longitude: 2.3522 },
        pricePerHour: 8.0,
      },
      {
        name: "Hospital Parking",
        location: { latitude: "35.6895", longitude: "139.6917" },
        availableSpaces: 75,
        coordinates: { latitude: 35.6895, longitude: 139.6917 },
        pricePerHour: 4.0,
      },
      {
        name: "Stadium Parking",
        location: { latitude: "55.7558", longitude: "37.6173" },
        availableSpaces: 150,
        coordinates: { latitude: 55.7558, longitude: 37.6173 },
        pricePerHour: 6.5,
      },
      {
        name: "Beach Parking",
        location: { latitude: "36.7783", longitude: "-119.4179" },
        availableSpaces: 60,
        coordinates: { latitude: 36.7783, longitude: -119.4179 },
        pricePerHour: 5.5,
      },
      {
        name: "Business Tower Parking",
        location: { latitude: "41.8781", longitude: "-87.6298" },
        availableSpaces: 40,
        coordinates: { latitude: 41.8781, longitude: -87.6298 },
        pricePerHour: 9.0,
      },
      {
        name: "University Parking",
        location: { latitude: "45.4642", longitude: "9.1900" },
        availableSpaces: 90,
        coordinates: { latitude: 45.4642, longitude: 9.1900 },
        pricePerHour: 2.5,
      }
    ];

    await addSlotModel.insertMany(parkingAreas);
    res.status(201).json({ message: "Dummy data inserted successfully" });
  } catch (err) {
    console.error("Error inserting dummy data:", err);
    res.status(500).json({ message: "Failed to insert dummy data", error: err.message });
  }
};
