const express = require("express");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/role");
const Transaction = require("../models/Transaction");

const router = express.Router();

// GET /api/users (admin – list users)
router.get("/", protect, requireAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
});

// GET /api/users/:id (admin – details)
router.get("/:id", protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
});


// POST /api/users/:id/balance (admin – add/subtract)
router.post("/:id/balance", protect, requireAdmin, async (req, res) => {
  try {
    const { amount } = req.body; // can be + or -
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.balance += Number(amount);
    await user.save();

    await Transaction.create({
      user: user._id,
      type: amount >= 0 ? "deposit" : "withdrawal",
      amount: Math.abs(amount),
      note: "Admin manual adjustment",
    });

    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
