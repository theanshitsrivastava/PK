const axios = require('axios');
const supabase = require('../Services/supabase');

// Get available parking slots
exports.getParkingSlots = async (req, res) => {
  try {
    // Fetch the available parking slots from the database
    const { data, error } = await supabase.from('parking_slots').select('*');

    if (error) {
      throw new Error('Failed to fetch parking slots');
    }

    // Respond with parking slots
    res.json(data);
  } catch (err) {
    console.error('Error fetching parking slots:', err.message);
    res.status(500).json({ message: 'Failed to fetch parking slots' });
  }
};

// Book a parking slot
exports.bookParkingSlot = async (req, res) => {
  const { slotId, bookingData } = req.body;

  try {
    // Prepare data for ML API
    const predictionRequest = {
      distance: bookingData.distance,
      available_slots: bookingData.availableSlots,
      peak_hours: bookingData.peakHours,
      weekend: bookingData.weekend,
    };

    // Call the ML API to get the predicted price
    const predictionResponse = await axios.post('http://127.0.0.1:5000/predict', predictionRequest);
    const predictedPrice = predictionResponse.data.predicted_price;

    // Fetch the current available slots for the selected parking slot
    const { data: parkingSlot, error: fetchError } = await supabase
      .from('parking_slots')
      .select('available_slots')
      .eq('id', slotId)
      .single(); // Fetch single row by slotId

    if (fetchError) {
      throw new Error('Error fetching parking slot details');
    }

    // Check if there are available slots
    if (parkingSlot.available_slots <= 0) {
      return res.status(400).json({ message: 'No available slots left' });
    }

    // Decrease available slots by 1 after booking
    const updatedAvailableSlots = parkingSlot.available_slots - 1;

    // Update the available slots in the database
    const { data, error: updateError } = await supabase
      .from('parking_slots')
      .update({ available_slots: updatedAvailableSlots })
      .eq('id', slotId);

    if (updateError) {
      throw new Error('Error updating available slots');
    }

    // Save the booking data to the 'bookings' table
    const { data: bookingData, error: insertError } = await supabase.from('bookings').insert([
      {
        slot_id: slotId,
        distance: bookingData.distance,
        available_slots: bookingData.availableSlots,
        peak_hours: bookingData.peakHours,
        weekend: bookingData.weekend,
        predicted_price: predictedPrice,
      },
    ]);

    if (insertError) {
      throw new Error('Error inserting booking data');
    }

    // Respond with the booking confirmation and predicted price
    res.json({
      message: 'Parking slot booked successfully',
      slotId,
      predictedPrice,
    });
  } catch (err) {
    console.error('Error booking parking slot:', err.message);
    res.status(500).json({ message: 'Failed to book parking slot', error: err.message });
  }
};
