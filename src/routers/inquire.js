const express = require("express");
const Inquire = require("../models/inquire"); // Import the Inquire model
const router = new express.Router();

// Create a new inquiry
router.post("/inquire", async (req, res) => {
  try {
    const { professional, manualBookingDetails,onlineBookingDetails } = req.body;

    // Create a new inquiry instance
    const inquire = new Inquire({
      professional,
      manualBookingDetails,
      onlineBookingDetails
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
router.get("/inquire/", async (req, res) => {
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
router.post("/inquire/:professionalId", async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { manualBookingDetails, onlineBookingDetails } = req.body;

    // Find the inquiry by professional ID
    const inquire = await Inquire.findOne({ professional: professionalId });
    if (!inquire) {
      return res.status(404).send({ message: "Inquiry not found" });
    }

   // Only overwrite the fields that are sent
   if (manualBookingDetails?.length) {
    inquire.manualBookingDetails.push(...manualBookingDetails);
  }
  if (onlineBookingDetails?.length) {
    inquire.onlineBookingDetails.push(...onlineBookingDetails);
  }


    // Save the updated inquiry
    const updatedInquire = await inquire.save();

    // Populate the professional details
    await updatedInquire.populate("professional");

    res.status(200).send({
      message: "Inquiry updated successfully",
      inquire: updatedInquire,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
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