const express = require("express");
const Service = require("../models/service");
const Professional = require("../models/professional"); // Assuming you have a Professional model
const router = new express.Router();

// Create a service
router.post("/service", async (req, res) => {
  try {
    const { title, time, price, assignedProfessionals } = req.body;
    const service = new Service({
      title,
      time,
      price,
      assignedProfessionals, // Include assigned professionals here
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
      .populate('assignedProfessionals', 'name')  // Select only the `name` field for professionals
      .select('title time price assignedProfessionals'); // Optional: select fields for the service
    
    if (!services || services.length === 0) {
      return res.status(404).send({ message: "No services found" });
    }

    res.status(200).send({ services });
  } catch (e) {
    res.status(500).send({ error: "Error fetching services" });
  }
});

// Update a service by ID
router.patch("/service/:id", async (req, res) => {
  const updates = Object.keys(req.body); // Get all keys from the request body
  const allowedUpdates = ["title", "time", "price", "assignedProfessionals"]; // Include assignedProfessionals

  // Check if all updates are valid
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidUpdate) {
    return res.status(400).send({ message: "Invalid updates!" });
  }

  try {
    // Update the service
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // new: return updated doc, runValidators: validate schema
    );

    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }

    res.status(200).send({
      message: "Service updated successfully",
      service,
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
