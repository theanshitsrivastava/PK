const addSlotModel = require('../models/addSlotModel');

// Add a new parking slot
exports.addParkingSlot = async (req, res) => {
  const { name, location, availableSpaces, latitude, longitude, pricePerHour } = req.body;

  try {
    const newSlot = new addSlotModel({
      name,
      location,
      availableSpaces,
      coordinates: { latitude, longitude },
      pricePerHour,
    });

    await newSlot.save();
    res.status(201).json({ message: 'Parking slot added successfully', slot: newSlot });
  } catch (err) {
    console.error('Error adding parking slot:', err.message);
    res.status(500).json({ message: 'Failed to add parking slot' });
  }
};

// Get all parking slots
exports.getAllSlots = async (req, res) => {
    try {
      const { location } = req.query; // Extract location from query string
  
      // Filter slots by location if a location is provided
      const filter = location ? { location: new RegExp(location, 'i') } : {};
  
      const slots = await addSlotModel.find(filter); // Search the database
      res.json(slots); // Return the filtered slots
    } catch (err) {
      console.error('Error fetching parking slots:', err.message);
      res.status(500).json({ message: 'Failed to fetch parking slots' });
    }
  };
  

// Delete a parking slot
exports.deleteParkingSlot = async (req, res) => {
  const { id } = req.params;

  try {
    await ParkingSlot.findByIdAndDelete(id);
    res.status(200).json({ message: 'Parking slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete parking slot' });
  }
};
