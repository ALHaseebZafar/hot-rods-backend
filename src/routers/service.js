const express = require("express");
const Service = require("../models/service");
const Professional = require("../models/professional");
const router = new express.Router();

// Create a service
router.post("/service", async (req, res) => {
  try {
    const { title, time, price, assignedProfessionals } = req.body;
    const service = new Service({
      title,
      time,
      price,
      assignedProfessionals,
    });
    await service.save();
    res.status(201).send({
      message: "Service created successfully",
      service,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all services
router.get("/service", async (req, res) => {
  try {
    const services = await Service.find()
      .populate("assignedProfessionals", "name") // Populate assigned professionals
      .select("title time price assignedProfessionals");

    res.status(200).send({ services });
  } catch (e) {
    res.status(500).send({ error: "Error fetching services" });
  }
});

// Update a service by ID
router.patch("/service/:id", async (req, res) => {
  try {
    const allowedUpdates = ["title", "time", "price", "assignedProfessionals"];
    const updates = Object.keys(req.body);

    // Check for invalid fields
    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates!" });
    }

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).send({ error: "Service not found" });
    }

    // Apply updates dynamically
    updates.forEach((update) => {
      service[update] = req.body[update];
    });

    await service.save();

    // Populate the updated service
    const updatedService = await Service.findById(req.params.id).populate(
      "assignedProfessionals",
      "name"
    );

    res.status(200).send({
      message: "Service updated successfully",
      service: updatedService,
    });
  } catch (err) {
    res.status(400).send({ error: "Error updating the service" });
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
