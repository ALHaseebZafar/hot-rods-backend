const express = require("express");
const Service = require("../models/service");
const router = new express.Router();

// Create a service
router.post("/service", async (req, res) => {
  try {
    const { title, time, price } = req.body;
    const service = new Service({
      title,
      time,
      price,
    });
    await service.save();
    res.status(201).send({
      message: "Service created successfully",
      service,
    });
  } catch (err) {
    res.status(400).send({ error: e.message });
  }
});
// Get all services
router.get("/service", async (req, res) => {
  try {
    const service = await Service.find();
    if (!service) {
      return res.status(404).send({ message: "No service found" });
    }

    res.status(200).send({ service });
  } catch (e) {
    res.status(500).send({ error: "Error fetching service" });
  }
});

// Update a service by ID
router.patch("/service/:id", async (req, res) => {
  const updates = Object.keys(req.body); // Get all keys from the request body
  const allowedUpdates = ["title", "time", "price"]; // Specify which fields can be updated

  // Check if all updates are valid
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ message: "Invalid updates!" });
  }

  try {
    // Update the service
    const serivce = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: return updated doc, runValidators: validate schema
    );

    if (!serivce) {
      return res.status(404).send({ message: "Service  not found" });
    }

    res.status(200).send({
      message: "Service updated successfully",
      serivce,
    });
  } catch (e) {
    res.status(400).send({ error: "Error updating the Service" });
  }
});

// Delete a service by ID
router.delete("/service/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.status(200).send({
      message: "Service deleted Successfully",
      service,
    });
  } catch (error) {
    res
      .status(500)
      .send({ error: "Server error. Could not delete the service." });
  }
});

module.exports = router;
