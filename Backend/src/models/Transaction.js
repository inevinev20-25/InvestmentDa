const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["deposit", "withdrawal", "adjustment"],
      required: true,
    },
    amount: { type: Number, required: true },
    note: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
