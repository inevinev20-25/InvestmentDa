const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    title: { type: String, default: "Admin" },

    fullName: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    accountType: { type: String, default: "single" },

    // Required for clients, optional for admin:
    phone: { type: String },
    dob: { type: String },
    address1: { type: String },
    address2: { type: String, default: "" },
    city: { type: String },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String },

    balance: { type: Number, default: 0 },

    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    role: {
      type: String,
      enum: ["client", "admin"],
      default: "client",
    },
  },
  { timestamps: true }
);

// Hash password
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema, "investment_users");
