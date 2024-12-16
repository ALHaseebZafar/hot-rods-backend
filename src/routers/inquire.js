const express = require("express");
const Inquire = require("../models/inquire"); // Import the Inquire model
const router = new express.Router();

// Create a new inquiry
router.post("/inquire", async (req, res) => {
  try {
    const { professional, manualBooking, manualBookingDetails, timeSlots, checkedByAdmin } = req.body;

    // Validate manual booking details if manualBooking is true
    if (manualBooking) {
      if (
        !manualBookingDetails ||
        !manualBookingDetails.date ||
        !manualBookingDetails.startTime ||
        !manualBookingDetails.endTime
      ) {
        return res
          .status(400)
          .send({ message: "Manual booking requires date, startTime, and endTime." });
      }
    } else {
      // Validate that timeSlots is an array and contains at least one slot
      if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
        return res.status(400).send({ message: "Time slots are required for non-manual booking." });
      }
    }

    // Create a new inquiry instance
    const inquire = new Inquire({
      professional,
      manualBooking,
      manualBookingDetails: manualBooking ? manualBookingDetails : undefined,
      timeSlots: manualBooking ? [] : timeSlots,
      checkedByAdmin,
    });

    // Save the inquiry to the database
    await inquire.save();

    // Respond with success
    res.status(201).send({
      message: "Inquiry created successfully",
      inquire,
    });
  } catch (e) {
    // Handle errors
    res.status(400).send({ error: e.message });
  }
});

// Get all inquiries
router.get("/inquire", async (req, res) => {
  try {
    const inquires = await Inquire.find()
      .populate("professional", "name image") // Populate professional details
      .exec();

    if (inquires.length === 0) {
      return res.status(404).send({ message: "No inquiries found" });
    }

    res.status(200).send({ inquires });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// Get a specific inquiry by ID
router.get("/inquire/:professionalId", async (req, res) => {
  try {
    const { professionalId } = req.params;

    // Find inquiries by professional ID
    const inquiries = await Inquire.find({ professional: professionalId })
      .populate("professional", "name image") // Populate professional details
      .exec();

    if (!inquiries || inquiries.length === 0) {
      return res.status(404).send({ message: "No inquiries found for this professional" });
    }

    res.status(200).send({ inquiries });
  } catch (e) {
    console.error("Error fetching inquiries:", e.message);
    res.status(500).send({ error: e.message });
  }
});

// Update an inquiry by ID
// Update an inquiry by ID (Updated)
router.patch("/inquire/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { manualBooking, manualBookingDetails, timeSlots } = req.body;

    // Find the existing inquiry
    const inquire = await Inquire.findById(id);
    
    if (!inquire) {
      return res.status(404).send({ message: "Inquiry not found" });
    }

    // Update booking type
    inquire.manualBooking = manualBooking;

    // Reset previous booking details based on new booking type
    if (manualBooking) {
      // Validate manual booking details
      if (
        !manualBookingDetails ||
        !manualBookingDetails.date ||
        !manualBookingDetails.startTime ||
        !manualBookingDetails.endTime
      ) {
        return res
          .status(400)
          .send({ message: "Manual booking requires date, startTime, and endTime." });
      }

      // Set manual booking details and clear time slots
      inquire.manualBookingDetails = manualBookingDetails;
      inquire.timeSlots = [];
    } else {
      // Validate time slots for non-manual booking
      if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
        return res
          .status(400)
          .send({ message: "Time slots are required for non-manual booking." });
      }

      // Clear manual booking details and set time slots
      inquire.manualBookingDetails = undefined;
      inquire.timeSlots = timeSlots;
    }

    // Optional: Update professional if passed
    if (req.body.professional) {
      inquire.professional = req.body.professional;
    }

    // Optional: Update checked by admin status
    if (req.body.checkedByAdmin !== undefined) {
      inquire.checkedByAdmin = req.body.checkedByAdmin;
    }

    // Save updated inquiry
    await inquire.save();

    res.status(200).send({
      message: "Inquiry updated successfully",
      inquire,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

// Delete an inquiry by ID
router.delete("/inquire/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const inquire = await Inquire.findByIdAndDelete(id);

    if (!inquire) {
      return res.status(404).send({ message: "Inquiry not found" });
    }

    res.status(200).send({
      message: "Inquiry deleted successfully",
      inquire,
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
