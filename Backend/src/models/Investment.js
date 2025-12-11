const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  investmentType: { type: String, required: true },
  amount: { type: Number, required: true },
  startDate: { type: String, required: true },
  status: { type: String, default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("Investment", InvestmentSchema);
