const express = require("express");
const router = express.Router();
const ShopTiming = require("../models/shopTiming"); // Adjust the path based on your project structure

// 1. Create a new ShopTiming
router.post("/shop-timing", async (req, res) => {
  try {
    const newShopTiming = new ShopTiming({
      day: req.body.day,
      time: req.body.time,
    });

    const savedShopTiming = await newShopTiming.save();
    res.status(201).json(savedShopTiming);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. Get all ShopTimings
router.get("/shop-timing", async (req, res) => {
  try {
    const shopTimings = await ShopTiming.find();
    res.status(200).json(shopTimings);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. Get a specific ShopTiming by ID
router.get("/shop-timing/:id", async (req, res) => {
  try {
    const shopTiming = await ShopTiming.findById(req.params.id);
    if (!shopTiming) return res.status(404).json({ message: "ShopTiming not found" });
    res.status(200).json(shopTiming);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 4. Update a ShopTiming by ID
router.put("/shop-timing/:id", async (req, res) => {
  try {
    const updatedShopTiming = await ShopTiming.findByIdAndUpdate(
      req.params.id,
      {
        day: req.body.day,
        time: req.body.time,
      },
      { new: true }
    );
    if (!updatedShopTiming) return res.status(404).json({ message: "ShopTiming not found" });
    res.status(200).json(updatedShopTiming);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 5. Delete a ShopTiming by ID
router.delete("/shop-timing/:id", async (req, res) => {
  try {
    const deletedShopTiming = await ShopTiming.findByIdAndDelete(req.params.id);
    if (!deletedShopTiming) return res.status(404).json({ message: "ShopTiming not found" });
    res.status(200).json({ message: "ShopTiming deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;