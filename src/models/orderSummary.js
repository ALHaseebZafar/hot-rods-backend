const mongoose = require("mongoose");
const Professional = require("./professional");
const Service = require("./service");
const Appointment = require("./appointment"); // Import the Appointment model

const orderSummarySchema = new mongoose.Schema({
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professional", // Link to the Professional model
    required: true,
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // Link to the Service model
      required: true,
    },
  ],
  appointment: {
    // Add reference to the Appointment model
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true,
  },
  tip: {
    type: Number, // Additional tip the user wants to give
    default: 0,
  },
  totalServiceTime: {
    type: String, // This will hold the formatted time (e.g., "2 hours 30 minutes")
  },
  subTotal: {
    type: Number, // Total cost of selected services
    required: true,
  },
  grandTotal: {
    type: Number, // Subtotal + Tip
  },
});

// Method to calculate the order summary
orderSummarySchema.methods.calculateSummary = async function () {
  // Fetch all services by their IDs
  const services = await Service.find({ _id: { $in: this.services } });

  // Ensure services are correctly fetched
  if (!services || services.length === 0) {
    throw new Error("No services found for the given IDs");
  }

  // Fetch the appointment details (date and time)
  const appointment = await Appointment.findById(this.appointment);
  if (!appointment) {
    throw new Error("Appointment not found");
  }

  // Use the appointment date and time
  this.appointmentDate = appointment.date;
  this.appointmentTime = appointment.time;

  // Calculate the total minutes from all services
  let totalMinutes = 0;
  services.forEach((service) => {
    const serviceTimeInMinutes = service.convertTimeToMinutes(); // Convert each service's time to minutes
    totalMinutes += serviceTimeInMinutes; // Add to the total time
  });

  // Convert total minutes to hours and minutes
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  this.totalServiceTime = `${hours > 0 ? `${hours} hour(s)` : ""} ${
    minutes > 0 ? `${minutes} minute(s)` : ""
  }`.trim();

  // Calculate subtotal using the Service model's static method
  this.subTotal = Service.calculateSubtotal(services);

  // Add tip to calculate grand total
  this.grandTotal = this.subTotal + (this.tip || 0);

  // Save the updated document
  await this.save();

  return this; // Return the updated order summary
};

const OrderSummary = mongoose.model("OrderSummary", orderSummarySchema);
module.exports = OrderSummary;
