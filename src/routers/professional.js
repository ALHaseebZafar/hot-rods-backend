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

router.patch("/professional/:id", async (req, res) => {
  try {
      const updates = {
          availability: req.body.availability,
          notAvailable: req.body.availability ? [] : req.body.notAvailable,
          name: req.body.name,
          image: req.body.image,
      };

      const professional = await Professional.findByIdAndUpdate(req.params.id, updates, {
          new: true,
          runValidators: true,
      });

      if (!professional) {
          return res.status(404).send({ message: "Professional not found" });
      }

      res.status(200).send({
          message: "Professional updated successfully",
          professional,
      });
  } catch (err) {
      res.status(400).send({ error: err.message });
  }
});

router.get("/professional", async (req, res) => {
  try {
    const professionals = await Professional.find();
    if (!professionals) {
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
