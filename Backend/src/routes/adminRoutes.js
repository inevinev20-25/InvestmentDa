const express = require("express");
const User = require("../models/User");
const MoneyRequest = require("../models/MoneyRequest");
const Document = require("../models/Document");

const { protect } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/role");

const router = express.Router();

/* ======================================================
   ADMIN — GET ALL USERS
   GET /api/admin/users
====================================================== */
router.get("/users", protect, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({ role: "client" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("Admin Get Users Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN — GET USER DETAILS + DOCUMENTS
   GET /api/admin/users/:id
====================================================== */
router.get("/users/:id", protect, requireAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const documents = await Document.find({ user: user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user,
      documents,
    });
  } catch (err) {
    console.error("Admin Get User Detail Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN — EDIT USER DETAILS
   PUT /api/admin/users/:id
====================================================== */
router.put("/users/:id", protect, requireAdmin, async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "fullName",
      "email",
      "phone",
      "dob",
      "address1",
      "address2",
      "city",
      "state",
      "postalCode",
      "country",
      "accountType"
    ];

    let updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (err) {
    console.error("Edit User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


/* ======================================================
   ADMIN — RESET USER PASSWORD (HASHING FIXED)
   POST /api/admin/users/:id/reset-password
====================================================== */
router.post("/users/:id/reset-password", protect, requireAdmin, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6)
      return res.status(400).json({ message: "Password too short" });

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.password = password;
    user.markModified("password"); // IMPORTANT!

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN — DELETE USER
   DELETE /api/admin/users/:id
====================================================== */
router.delete("/users/:id", protect, requireAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN — UPDATE USER BALANCE
   POST /api/admin/users/:id/balance
====================================================== */
router.post("/users/:id/balance", protect, requireAdmin, async (req, res) => {
  try {
    const { amount, type } = req.body;

    if (!amount || amount <= 0)
      return res.status(400).json({ message: "Invalid amount" });

    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (type === "add") user.balance += amount;
    else if (type === "subtract") {
      if (user.balance < amount)
        return res.status(400).json({ message: "Insufficient balance" });
      user.balance -= amount;
    } else {
      return res.status(400).json({ message: "Invalid type" });
    }

    await user.save();

    res.status(200).json({
      success: true,
      balance: user.balance,
      message: "Balance updated",
    });
  } catch (err) {
    console.error("Balance Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN — APPROVE / REJECT KYC
====================================================== */
router.post("/kyc/verify/:id", protect, requireAdmin, async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status: "verified" },
      { new: true }
    );

    if (!doc)
      return res.status(404).json({ message: "Document not found" });

    await User.findByIdAndUpdate(doc.user, { kycStatus: "verified" });

    res.status(200).json({
      success: true,
      message: "KYC Verified",
    });
  } catch (err) {
    console.error("Verify KYC error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/kyc/reject/:id", protect, requireAdmin, async (req, res) => {
  try {
    const doc = await Document.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!doc)
      return res.status(404).json({ message: "Document not found" });

    await User.findByIdAndUpdate(doc.user, { kycStatus: "rejected" });

    res.status(200).json({
      success: true,
      message: "KYC Rejected",
    });

  } catch (err) {
    console.error("Reject KYC error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN — GET ALL MONEY REQUESTS
====================================================== */
router.get("/transactions", protect, requireAdmin, async (req, res) => {
  try {
    const requests = await MoneyRequest.find()
      .populate("user", "fullName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (err) {
    console.error("Admin Get Transactions Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
   ADMIN — UPDATE TRANSACTION STATUS
====================================================== */
router.put("/transactions/:id", protect, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const reqObj = await MoneyRequest.findById(req.params.id);

    if (!reqObj)
      return res.status(404).json({ message: "Request not found" });

    reqObj.status = status;
    await reqObj.save();

    res.status(200).json({
      success: true,
      message: "Transaction updated",
    });
  } catch (err) {
    console.error("Update Transaction Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;
