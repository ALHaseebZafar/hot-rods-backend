const express = require("express");
const Professional = require("../models/professional");
const router = new express.Router();

// Create a professional
router.post("/professional", async (req, res) => {
  try {
    const { name, image } = req.body;

    // Create a new professional (exclude availability and notAvailable)
    const professional = new Professional({
      name,
      image,
    });

    await professional.save();
    res.status(201).send({
      message: "Professional created successfully",
      professional,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
    console.error(err);
  }
});

// Update a professional by ID
router.patch("/professional/:id", async (req, res) => {
  try {
    const professionalId = req.params.id;

    // Validate input
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "availability", "image", "notAvailable"];
    const isValidUpdate = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidUpdate) {
      return res.status(400).send({ message: "Invalid updates!" });
    }

    // Format availability if provided
    if (req.body.availability) {
      req.body.availability = req.body.availability.map((entry) => ({
        date: new Date(entry.date),
        day: new Date(entry.date).toLocaleDateString("en-US", {
          weekday: "long",
        }),
      }));
    }

    // Update the professional
    const professional = await Professional.findByIdAndUpdate(
      professionalId,
      req.body,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
      }
    );

    if (!professional) {
      return res.status(404).send({ message: "Professional not found" });
    }

    res.status(200).send({
      message: "Professional updated successfully",
      professional,
    });
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).send({
      error: "Error updating professional",
      details: err.message,
    });
  }
});
// Get all professionals
router.get("/professional", async (req, res) => {
  try {
    const professionals = await Professional.find();
    if (!professionals || professionals.length === 0) {
      return res.status(404).send({ message: "No professionals found" });
    }
    res.status(200).send({ professionals });
  } catch (err) {
    res.status(500).send({ error: "Error fetching professionals" });
  }
});

// Delete a professional by ID
router.delete("/professional/:id", async (req, res) => {
  try {
    const professional = await Professional.findByIdAndDelete(req.params.id);
    if (!professional) {
      return res.status(404).send({ message: "Professional not found" });
    }

    res.status(200).send({
      message: "Professional deleted successfully",
      professional,
    });
  } catch (err) {
    res.status(500).send({
      error: "Server error. Could not delete the professional.",
    });
  }
});

module.exports = router;
