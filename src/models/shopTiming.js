const mongoose = require("mongoose");

const shopTimingSchema = new mongoose.Schema({
    day: {
        type: String, // Changed to String to store day names
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      },
      time: {
        type: String, // Store time in "HH:MM-HH:MM" format
        required: true,
      }
});


const ShopTiming = mongoose.model("ShopTiming", shopTimingSchema);
module.exports = ShopTiming;
