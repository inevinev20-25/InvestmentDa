const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const User = require("./models/User");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ============================================================
   AUTO-CREATE DEFAULT ADMIN (RUNS ONLY IF NO ADMIN EXISTS)
   ============================================================ */
async function createDefaultAdmin() {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (!adminExists) {
      await User.create({
        fullName: "Administrator",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: "admin",
      });

      console.log(" Default admin created successfully");
    } else {
      console.log(" Admin already exists – skipping creation");
    }
  } catch (err) {
    console.error(" Failed to create admin:", err);
  }
}
createDefaultAdmin();

/* ============================================================
   ROUTES
   ============================================================ */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/investments", require("./routes/investmentRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/money-requests", require("./routes/moneyRequestRoutes"));
app.use("/api/admin/investments", require("./routes/adminInvestmentRoutes"));

/* ============================================================
   SERVER START
   ============================================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
