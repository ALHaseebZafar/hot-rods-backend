const express = require("express");
const Inquire = require("../models/inquire"); // Import the Inquire model
const router = new express.Router();

// Create a new inquiry
router.post("/inquire", async (req, res) => {
  try {
    const { professional, manualBookingDetails } = req.body;

    // Create a new inquiry instance
    const inquire = new Inquire({
      professional,
      manualBookingDetails
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
    const inquires = await Inquire.find().populate("professional", "name availability").exec();
    res.status(200).send({ inquires }); // Always return an empty array instead of 404
  } catch (e) {
    console.error("Error fetching inquiries:", e.message);
    res.status(500).send({ error: e.message });
  }
});

// Get a specific inquiry by professional ID
router.get("/inquire/:professionalId", async (req, res) => {
  try {
    const { professionalId } = req.params;

    // Find inquiries by professional ID
    const inquiries = await Inquire.find({ professional: professionalId })
      .populate("professional", "name availability notAvailable")
      .exec();

    // Check if inquiries exist
    if (!inquiries || inquiries.length === 0) {
      return res.status(404).send({ message: "No inquiries found for this professional" });
    }

    // Respond with inquiries
    res.status(200).send({ inquiries });
  } catch (e) {
    console.error("Error fetching inquiries:", e.message);
    res.status(500).send({ error: e.message });
  }
});

// Update an inquiry by ID
router.patch("/inquire/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { manualBookingDetails, professional } = req.body;

    // Find the existing inquiry
    const inquire = await Inquire.findById(id);

    if (!inquire) {
      return res.status(404).send({ message: "Inquiry not found" });
    }

    // Update manual booking details
    if (manualBookingDetails) {
      inquire.manualBookingDetails = manualBookingDetails;
    }

    // Optional: Update professional if passed
    if (professional) {
      inquire.professional = professional;
    }

    // Save the updated inquiry
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