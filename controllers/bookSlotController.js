const ParkingSlot = require("../models/parkingSlot"); // ParkingSlot model
const addSlotModel = require("../models/addSlotModel");
const User = require("../models/user");

const autoBook = async (req, res) => {
  try {
    // Extract request data
    const { vehicleNumber, parkingAreaId } = req.body;

    // Find the parking area
    let parkingArea = await addSlotModel.findById(parkingAreaId);
    if (!parkingArea) {
      return res.status(404).json({ success: false, message: "Parking area not found." });
    }

    let user = await User.findOne({vehicleNumber});
    if(!user){
      return res.status(200).json({message:"Vehicle Must Be Registered"});
    }
    // Check if parking spaces are available
    if (parkingArea.availableSpaces <= 0) {
      return res.status(400).json({ success: false, message: "No available parking slots." });
    }

    // Find the first available slot (not occupied)
    let assignedSlot = 1; // Default slot number
    const occupiedSlots = new Set(parkingArea.occupiedSpace);

    // Find the lowest available slot number
    while (occupiedSlots.has(assignedSlot)) {
      assignedSlot++;
    }

    // Create a new parking slot instance
    const newSlot = new ParkingSlot({
      user:user._id,
      name: `Slot-${assignedSlot}`, // Assigning a slot name
      location: parkingArea._id, // Linking to parking area
      slot: assignedSlot, // Assigning slot number
      paymentStatus: false,
      amount: parkingArea.pricePerHour, // Price per hour from parking area
      entryTime: new Date(),
      exitTime: null, // Not set yet
    });

    await newSlot.save(); // Save the new parking slot

    // Update the parking area: Reduce available space & Add slot to occupiedSpace
    parkingArea.availableSpaces -= 1;
    parkingArea.occupiedSpace.push(assignedSlot);
    await parkingArea.save();

    return res.status(200).json({
      success: true,
      message: "Parking slot booked successfully",
      slot: newSlot,
    });
  } catch (error) {
    console.error("Error booking parking slot:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const leaveSlot = async (req, res) => {
  try {
    const { parkingAreaId } = req.body;
    // Find the parking slot
    const bookedSlot = await ParkingSlot.findOne({location:parkingAreaId});
    if (!bookedSlot) {
      return res.status(404).json({ success: false, message: "Parking slot not found." });
    }

    if (bookedSlot.exitTime) {
      return res.status(400).json({ success: false, message: "Slot already vacated." });
    }

    // Set exit time
    bookedSlot.exitTime = new Date();

    // Calculate the amount based on time spent
    const entryTime = new Date(bookedSlot.entryTime);
    const exitTime = new Date(bookedSlot.exitTime);
    const timeDiffInHours = Math.max(1, Math.ceil((exitTime - entryTime) / (1000 * 60 * 60))); // Ensures minimum 1 hour charge

    // Get the price per hour from the parking area
    const parkingArea = await addSlotModel.findById(bookedSlot.location);
    if (!parkingArea) {
      return res.status(404).json({ success: false, message: "Parking area not found." });
    }

    bookedSlot.amount = timeDiffInHours * parkingArea.pricePerHour;
    bookedSlot.paymentStatus = false;

    await bookedSlot.save(); // Save the updated slot data

    // Increase available spaces in the parking area
    parkingArea.availableSpaces += 1;

    // Remove the slot number from occupiedSpace array
    parkingArea.occupiedSpace = parkingArea.occupiedSpace.filter(slot => slot !== bookedSlot.slot);

    await parkingArea.save();

    return res.status(200).json({
      success: true,
      message: "Slot vacated successfully.",
      amountDue: bookedSlot.amount,
    });
  } catch (error) {
    console.error("Error leaving slot:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};


const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from request parameters

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Find all bookings related to this user, sorted by entry time (most recent first)
    const userBookings = await ParkingSlot.find({ user:userId })
      .sort({ entryTime: -1 }) // Sort in descending order (latest bookings first)
      .limit(10); // Optionally limit to the most recent 10 bookings

    if (userBookings.length === 0) {
      return res.status(404).json({ success: false, message: "No bookings found for this user." });
    }

    return res.status(200).json({
      success: true,
      message: "Recent bookings retrieved successfully.",
      bookings: userBookings,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {autoBook,leaveSlot, getUserBookings};
