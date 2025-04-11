const express = require('express');
const ParkingArea = require("../models/addSlotModel");

const router = express.Router();

// Routes

// CREATE a new parking area
router.post("/", async (req, res) => {
    try {
      const newArea = new ParkingArea(req.body);
      const saved = await newArea.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // READ all parking areas
  router.get("/", async (req, res) => {
    try {
      const areas = await ParkingArea.find();
      res.status(200).json(areas);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // READ one parking area by ID
  router.get("/:id", async (req, res) => {
    try {
      const area = await ParkingArea.findById(req.params.id);
      if (!area) return res.status(404).json({ message: "Not found" });
      res.status(200).json(area);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  // UPDATE a parking area
  router.put("/:id", async (req, res) => {
    try {
      const updated = await ParkingArea.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // DELETE a parking area
  router.delete("/:id", async (req, res) => {
    try {
      const deleted = await ParkingArea.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Not found" });
      res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
