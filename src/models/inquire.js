const mongoose = require("mongoose");
const Professional = require("../models/professional"); // Import Professional model

const inquireSchema = new mongoose.Schema({
  professional: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Professional model
    ref: "Professional",
    required: true,
  },
  manualBooking: {
    type: Boolean, // Indicates whether the booking is manual
    default: false,
  },
  timeSlots: [
    {
      day: {
        type: String, // Store the day (e.g., 'MON-FRI', 'SAT', 'SUN')
        required: true,
      },
      startTime: {
        type: String, // Start time (e.g., '10:00 AM')
        required: true,
      },
      endTime: {
        type: String, // End time (e.g., '11:00 AM')
        required: true,
      },
    },
  ],
  checkedByAdmin: {
    type: Boolean, // Flag to indicate if admin checked availability
    default: false,
  },
});

const Inquire = mongoose.model("Inquire", inquireSchema);
module.exports = Inquire;
