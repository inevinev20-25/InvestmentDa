// controllers/moneyRequestController.js
const MoneyRequest = require("../models/MoneyRequest");

// POST /api/money-requests
exports.createMoneyRequest = async (req, res) => {
  try {
    const { type, amount, method, note } = req.body;

    if (!type || !amount || !method) {
      return res.status(400).json({ message: "Type, amount and method are required" });
    }

    const moneyRequest = await MoneyRequest.create({
      user: req.user.id, // coming from auth middleware
      type,
      amount,
      method,
      note,
    });

    res.status(201).json(moneyRequest);
  } catch (err) {
    console.error("createMoneyRequest error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/money-requests/my
exports.getMyMoneyRequests = async (req, res) => {
  try {
    const requests = await MoneyRequest.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("getMyMoneyRequests error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Admin Endpoints (You can use these later in step D)
exports.getAllMoneyRequests = async (req, res) => {
  try {
    const requests = await MoneyRequest.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error("getAllMoneyRequests error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateMoneyRequestStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const request = await MoneyRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (status) request.status = status;
    if (adminNote) request.adminNote = adminNote;

    await request.save();
    res.json(request);
  } catch (err) {
    console.error("updateMoneyRequestStatus error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
