const mongoose = require("mongoose");

const inquireSchema = new mongoose.Schema({
  professional: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Professional model
    ref: "Professional",
    required: true,
  },
  manualBookingDetails: {
    date: {
      type: String, // Booking date (e.g., '2024-12-13')
      required: true,
    },
    startTime: {
      type: String, // Start time for manual booking (e.g., '10:00 AM')
      required: true,
    },
    endTime: {
      type: String, // End time for manual booking (e.g., '11:00 AM')
      required: true,
    },
  },
  onlineBookingDetails: {
    date: {
      type: String, // Booking date (e.g., '2024-12-13')
      required: true,
    },
    startTime: {
      type: String, // Start time for manual booking (e.g., '10:00 AM')
      required: true,
    },
    endTime: {
      type: String, // End time for manual booking (e.g., '11:00 AM')
      required: true,
    },
  },
});

const Inquire = mongoose.model("Inquire", inquireSchema);
module.exports = Inquire;
