const express = require("express");
const Appointment = require("../models/appointment");
const router = new express.Router();

router.post("/appointment", async (req, res) => {
  try {
    const { date, time, professional, services } = req.body;

    // Create a new appointment instance
    const appointment = new Appointment({
      date,
      time,
      professional,
      services,
    });

    // Save the appointment to the database
    await appointment.save();

    // Respond with success
    res.status(201).send({
      message: "Appointment created",
      appointment,
    });
  } catch (e) {
    // Handle errors
    res.status(400).send({ error: e.message });
  }
});

router.get("/appointment", async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("professional", "name image") // Populate professional details
      .populate("services", "title time price"); // Populate services details

    if (appointments.length === 0) {
      return res.status(404).send({ message: "No appointments found" });
    }

    res.status(200).send({ appointments });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.get("/appointment/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate("professional", "name image")
      .populate("services", "title time price");

    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    res.status(200).send({ appointment });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

router.patch("/appointment/:id", async (req, res) => {
  const allowedUpdates = ["date", "time", "professional", "services"];
  const updates = Object.keys(req.body);

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ message: "Invalid updates!" });
  }

  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // Return the updated document
    )
      .populate("professional", "name image")
      .populate("services", "title time price");

    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    res.status(200).send({
      message: "Appointment updated successfully",
      appointment,
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
});

router.delete("/appointment/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).send({ message: "Appointment not found" });
    }

    res.status(200).send({
      message: "Appointment deleted successfully",
      appointment,
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;
