const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const User = require("../models/User");  // ✅ FIXED
const upload = require("../middleware/upload");
const { protect } = require("../middleware/auth");
const { requireAdmin } = require("../middleware/role");


// -------------------------------
// CLIENT UPLOAD DOCUMENT
// -------------------------------
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {
    const doc = await Document.create({
      user: req.user._id,
      type: req.body.type,
      filename: req.file.filename,
    });

    res.json({ success: true, message: "Document uploaded", doc });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


// -------------------------------
// GET DOCUMENTS FOR A USER
// -------------------------------
router.get("/:userId", protect, async (req, res) => {
  const docs = await Document.find({ user: req.params.userId });
  res.json({ success: true, docs });
});


// -------------------------------
// ADMIN VERIFY DOCUMENT (MAIN ROUTE)
// -------------------------------
router.post("/verify/:id", protect, requireAdmin, async (req, res) => {
  try {
    // 1) Update document
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { status: "verified" },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // 2) Update user KYC status
    await User.findByIdAndUpdate(document.user, {
      kycStatus: "verified",
    });

    res.json({
      success: true,
      message: "Document verified & user KYC updated to VERIFIED",
      document,
    });

  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// -------------------------------
// ADMIN REJECT DOCUMENT
// -------------------------------
router.post("/reject/:id", protect, requireAdmin, async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      { status: "rejected" },
      { new: true }
    );

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    // update user KYC to rejected
    await User.findByIdAndUpdate(document.user, {
      kycStatus: "rejected",
    });

    res.json({
      success: true,
      message: "Document rejected & user KYC updated to REJECTED",
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
