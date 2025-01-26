const ParkingSlot = require('../models/parkingSlot');

// Get all parking slots
exports.getParkingSlots = async (req, res) => {
  try {
    const slots = await ParkingSlot.find(); // Fetch all parking slots
    res.status(200).json(slots);
  } catch (err) {
    console.error('Error fetching parking slots:', err.message);
    res.status(500).json({ message: 'Failed to fetch parking slots' });
  }
};

// Add a parking slot (for testing purpose)
exports.addParkingSlot = async (req, res) => {
  const { name, location, availableSpaces } = req.body;

  try {
    const slot = new ParkingSlot({ name, location, availableSpaces });
    await slot.save();
    res.status(201).json({ message: 'Parking slot added successfully', slot });
  } catch (err) {
    console.error('Error adding parking slot:', err.message);
    res.status(500).json({ message: 'Failed to add parking slot' });
  }
};

// Get parking slots, optionally filtering by location
exports.getParkingSlots = async (req, res) => {
  try {
    const { location } = req.query; // Get 'location' query parameter

    // Query parking slots; filter by location if provided
    const filter = location ? { location: new RegExp(location, 'i') } : {}; // Case-insensitive regex
    const slots = await ParkingSlot.find(filter);

    res.status(200).json(slots);
  } catch (err) {
    console.error('Error fetching parking slots:', err.message);
    res.status(500).json({ message: 'Error fetching parking slots' });
  }
};
