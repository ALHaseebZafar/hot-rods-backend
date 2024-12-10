const express = require("express");
const router = express.Router();
const OrderSummary = require("../models/orderSummary");

// Create a new order summary
router.post("/order-summary", async (req, res) => {
  try {
    const { professional, services, appointment, tip } = req.body;

    const orderSummary = new OrderSummary({
      professional,
      services,
      appointment,
      tip: tip || 0,
    });

    // Calculate the summary
    const updatedOrderSummary = await orderSummary.calculateSummary();

    res.status(201).send({
      message: "Order summary created successfully",
      orderSummary: updatedOrderSummary,
    });
  } catch (e) {
    console.error("Error:", e.message); // Debugging
    res.status(500).send({ error: e.message });
  }
});

// Get all order summaries
router.get("/order-summary", async (req, res) => {
  try {
    const orderSummaries = await OrderSummary.find()
      .populate("professional") // Populate professional details
      .populate("services"); // Populate service details

    res.status(200).send({
      message: "Order summaries retrieved successfully",
      orderSummaries,
    });
  } catch (e) {
    console.error("Error:", e.message); // Debugging
    res.status(500).send({ error: e.message });
  }
});

// Get a specific order summary by ID
router.get("/order-summary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const orderSummary = await OrderSummary.findById(id)
      .populate("professional")
      .populate("services");

    if (!orderSummary) {
      return res.status(404).send({ message: "Order summary not found" });
    }

    res.status(200).send({
      message: "Order summary retrieved successfully",
      orderSummary,
    });
  } catch (e) {
    console.error("Error:", e.message);
    res.status(500).send({ error: e.message });
  }
});

// Update an order summary by ID
router.patch("/order-summary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { professional, services, appointmentDate, appointmentTime, tip } =
      req.body;

    const orderSummary = await OrderSummary.findById(id);

    if (!orderSummary) {
      return res.status(404).send({ message: "Order summary not found" });
    }

    // Update fields
    if (professional) orderSummary.professional = professional;
    if (services) orderSummary.services = services;
    if (appointmentDate) orderSummary.appointmentDate = appointmentDate;
    if (appointmentTime) orderSummary.appointmentTime = appointmentTime;
    if (tip !== undefined) orderSummary.tip = tip;

    // Recalculate summary
    const updatedOrderSummary = await orderSummary.calculateSummary();

    res.status(200).send({
      message: "Order summary updated successfully",
      orderSummary: updatedOrderSummary,
    });
  } catch (e) {
    console.error("Error:", e.message);
    res.status(500).send({ error: e.message });
  }
});

// Delete an order summary by ID
router.delete("/order-summary/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const orderSummary = await OrderSummary.findByIdAndDelete(id);

    if (!orderSummary) {
      return res.status(404).send({ message: "Order summary not found" });
    }

    res.status(200).send({
      message: "Order summary deleted successfully",
      orderSummary,
    });
  } catch (e) {
    console.error("Error:", e.message);
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
