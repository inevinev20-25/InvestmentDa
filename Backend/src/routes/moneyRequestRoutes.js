const express = require("express");
const router = express.Router();
const {
  createMoneyRequest,
  getMyMoneyRequests,
  getAllMoneyRequests,
  updateMoneyRequestStatus,
} = require("../controllers/moneyRequestController");

const { protect, admin } = require("../middleware/auth");

// User routes
router.post("/", protect, createMoneyRequest);
router.get("/my", protect, getMyMoneyRequests);

// Admin routes
router.get("/", protect, admin, getAllMoneyRequests);
router.put("/:id", protect, admin, updateMoneyRequestStatus);

module.exports = router;
