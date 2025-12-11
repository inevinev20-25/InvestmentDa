const express = require("express");
const Transaction = require("../models/Transaction");
const { protect } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/role");

const router = express.Router();

// GET /api/transactions/mine (client)
router.get("/mine", protect, async (req, res) => {
  const txns = await Transaction.find({ user: req.user._id }).sort("-createdAt");
  res.json(txns);
});

// GET /api/transactions/user/:id (admin)
router.get("/user/:id", protect, requireAdmin, async (req, res) => {
  const txns = await Transaction.find({ user: req.params.id }).sort("-createdAt");
  res.json(txns);
});

module.exports = router;
