const express = require("express");
const Service = require("../models/service");
const Professional = require("../models/professional"); // Assuming you have this model
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
    res.status(400).send({ error: err.message });
  }
});

// Get all services
router.get("/service", async (req, res) => {
  try {
    const services = await Service.find();
    if (!services || services.length === 0) {
      return res.status(404).send({ message: "No services found" });
    }

    res.status(200).send({ services });
  } catch (err) {
    res.status(500).send({ error: "Error fetching services" });
  }
});

// Get a single service by ID
router.get("/service/:id", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }
    res.status(200).send({ service });
  } catch (err) {
    res.status(500).send({ error: "Error fetching service" });
  }
});

// Update a service by ID
router.patch("/service/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["title", "time", "price"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ message: "Invalid updates!" });
  }

  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }

    res.status(200).send({
      message: "Service updated successfully",
      service,
    });
  } catch (err) {
    res.status(400).send({ error: "Error updating service" });
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
      message: "Service deleted successfully",
      service,
    });
  } catch (err) {
    res.status(500).send({
      error: "Server error. Could not delete the service.",
    });
  }
});

// Assign a service to a professional
router.patch("/service/:serviceId/assign/:professionalId", async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }

    const professional = await Professional.findById(req.params.professionalId);
    if (!professional) {
      return res.status(404).send({ message: "Professional not found" });
    }

    // Add professional to service's 'professionals' array
    if (!service.professionals.includes(professional._id)) {
      service.professionals.push(professional._id);
      await service.save();
    }

    res.status(200).send({
      message: "Service assigned to professional successfully",
      service,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Remove a service from a professional
router.patch("/service/:serviceId/remove/:professionalId", async (req, res) => {
  try {
    const service = await Service.findById(req.params.serviceId);
    if (!service) {
      return res.status(404).send({ message: "Service not found" });
    }

    const professional = await Professional.findById(req.params.professionalId);
    if (!professional) {
      return res.status(404).send({ message: "Professional not found" });
    }

    // Remove professional from service's 'professionals' array
    const index = service.professionals.indexOf(professional._id);
    if (index > -1) {
      service.professionals.splice(index, 1);
      await service.save();
    }

    res.status(200).send({
      message: "Service removed from professional successfully",
      service,
    });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Get all services for a professional
router.get("/professional/:id/services", async (req, res) => {
  try {
    const professional = await Professional.findById(req.params.id);
    if (!professional) {
      return res.status(404).send({ message: "Professional not found" });
    }

    // Fetch all services assigned to the professional
    const services = await Service.find({ professionals: professional._id });
    res.status(200).send({ services });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});

// Calculate the subtotal for selected services
router.post("/service/subtotal", async (req, res) => {
  try {
    const { selectedServices } = req.body; // Expecting an array of service IDs
    const services = await Service.find({ _id: { $in: selectedServices } });
    
    if (services.length !== selectedServices.length) {
      return res.status(404).send({ message: "Some services not found" });
    }

    const subtotal = Service.calculateSubtotal(services);
    res.status(200).send({ subtotal });
  } catch (err) {
    res.status(500).send({ error: "Error calculating subtotal" });
  }
});

module.exports = router;
