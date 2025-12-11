// models/MoneyRequest.js
const mongoose = require("mongoose");

const moneyRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAW"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    method: {
      type: String, // e.g. "Bank Transfer", "UPI", etc.
      required: true,
    },
    note: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "COMPLETED"],
      default: "PENDING",
    },
    adminNote: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MoneyRequest", moneyRequestSchema);
