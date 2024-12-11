const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: String, // Store time as a string (e.g., "1 hour 30 minutes")
    required: true,
  },
  price: {
    type: String, // Price as a string, will be converted to an integer
    required: true,
  },
  assignedProfessionals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professional', // Link to the Professional model
    default: []
  }],
});

// Method to convert time in string format ("1 hour 30 minutes") to minutes
serviceSchema.methods.convertTimeToMinutes = function () {
  const timeString = this.time.toLowerCase(); // Make sure to handle case insensitivity
  const timeParts = timeString.split(" "); // Split into individual parts (e.g., ["1", "hour", "30", "minutes"])
  let totalMinutes = 0;

  // Loop through each part to handle hours and minutes
  for (let i = 0; i < timeParts.length; i++) {
    const part = timeParts[i];

    if (part.includes("hour")) {
      // Handle "hour(s)"
      const hours = parseInt(timeParts[i - 1]); // The number before "hour"
      totalMinutes += hours * 60; // Convert hours to minutes
    }

    if (part.includes("minute")) {
      // Handle "minute(s)"
      const minutes = parseInt(timeParts[i - 1]); // The number before "minute"
      totalMinutes += minutes; // Add minutes directly
    }
  }

  console.log(`Total Minutes: ${totalMinutes}`); // Debugging log
  return totalMinutes;
};

// Method to convert time in minutes to hours and minutes
serviceSchema.methods.convertTimeToHoursAndMinutes = function () {
  const totalMinutes = this.convertTimeToMinutes(); // Convert time to minutes first
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours > 0 ? hours + " hour(s)" : ""} ${minutes} minute(s)`;
};

// Static method to calculate the subtotal for selected services
serviceSchema.statics.calculateSubtotal = function (services) {
  let subtotal = 0;
  services.forEach((service) => {
    const price = parseInt(service.price); // Convert price to integer
    subtotal += price; // Add price to subtotal
  });
  return subtotal;
};

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
