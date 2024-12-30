const mongoose = require("mongoose");


const inquireSchema = new mongoose.Schema({
  professional: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Professional model
    ref: "Professional",
    required: true,
  },
  manualBookingDetails: [
    {
      date: {
        type: String, // Booking date (e.g., '2024-12-13')
      },
      startTime: {
        type: String, // Start time for manual booking (e.g., '10:00 AM')
      },
      endTime: {
        type: String, // End time for manual booking (e.g., '11:00 AM')
      },
    },
  ],
  onlineBookingDetails: [
    {
      date: {
        type: String, // Booking date (e.g., '2024-12-13')
      },
      startTime: {
        type: String, // Start time for online booking (e.g., '10:00 AM')
      },
      endTime: {
        type: String, // End time for online booking (e.g., '11:00 AM')
      },
    },
  ],
});

const Inquire = mongoose.model("Inquire", inquireSchema);
module.exports = Inquire;
