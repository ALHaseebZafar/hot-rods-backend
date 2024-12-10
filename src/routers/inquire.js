const express = require("express");
const Inquire = require("../models/inquire");  // Import the Inquire model
const router = new express.Router();

// Create a new inquiry
router.post("/inquire", async (req, res) => {
  try {
    const { professional, manualBooking, timeSlots } = req.body;

    // Validate that timeSlots is an array and contains at least one slot
    if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).send({ message: "Time slots are required" });
    }

    // Create a new inquire instance
    const inquire = new Inquire({
      professional,
      manualBooking,
      timeSlots,
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
router.get("/inquire/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const inquire = await Inquire.findById(id)
      .populate("professional", "name image")
      .exec();

    if (!inquire) {
      return res.status(404).send({ message: "Inquiry not found" });
    }

    res.status(200).send({ inquire });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

// Update an inquiry by ID
router.patch("/inquire/:id", async (req, res) => {
  const allowedUpdates = ["manualBooking", "timeSlots", "checkedByAdmin"];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ message: "Invalid updates!" });
  }

  try {
    const { id } = req.params;

    // Update the inquiry with the provided fields
    const inquire = await Inquire.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    }).populate("professional", "name image");

    if (!inquire) {
      return res.status(404).send({ message: "Inquiry not found" });
    }

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
