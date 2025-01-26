const axios = require('axios');

// Function to get price prediction from the ML model
exports.getPredictedPrice = async (bookingData) => {
  try {
    const response = await axios.post('http://localhost:5001/predict', bookingData);
    return response.data.predicted_price;
  } catch (error) {
    console.error('Error fetching price prediction:', error);
    throw error;
  }
};
