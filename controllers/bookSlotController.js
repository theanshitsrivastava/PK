const addSlotModel = require('../models/addSlotModel');

// Book a parking slot
exports.bookSlot = async (req, res) => {
    const { slotId } = req.body; // Extract slot ID from the request body
  
    try {
      // Find the parking slot by ID
      const slot = await addSlotModel.findById(slotId);
  
      if (!slot) {
        return res.status(404).json({ message: 'Parking slot not found' });
      }
  
      if (slot.availableSpaces === 0) {
        return res.status(400).json({ message: 'No spaces available in this slot' });
      }
  
      // Reduce the available spaces by 1
      slot.availableSpaces -= 1;
      await slot.save();
  
      res.json({ message: 'Slot booked successfully', slot });
    } catch (err) {
      console.error('Error booking slot:', err.message);
      res.status(500).json({ message: 'Failed to book slot' });
    }
  };
  