const express = require("express");
const router = express.Router();
const Investment = require("../models/Investment");
const { protect } = require("../middleware/auth");

// GET investments for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const data = await Investment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, investments: data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ADD investment
router.post("/add", protect, async (req, res) => {
  try {
    const { investmentType, amount, startDate } = req.body;

    if (!investmentType || !amount || !startDate) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newInvestment = new Investment({
      userId: req.user._id,
      investmentType,
      amount,
      startDate,
      status: "Active"
    });

    await newInvestment.save();
    res.json({ success: true, investment: newInvestment });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
