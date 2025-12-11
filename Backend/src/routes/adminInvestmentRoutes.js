const express = require("express");
const router = express.Router();
const Investment = require("../models/Investment");
const { protect } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/role");

// GET all investments
router.get("/", protect, requireAdmin, async (req, res) => {
  try {
    const data = await Investment.find().sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single investment
router.get("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    res.json({ success: true, investment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE investment
router.put("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const updated = await Investment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ success: true, message: "Updated successfully", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE investment
router.delete("/:id", protect, requireAdmin, async (req, res) => {
  try {
    await Investment.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Investment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
