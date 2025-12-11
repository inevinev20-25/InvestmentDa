const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const moneyRequestRoutes = require("./routes/moneyRequestRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// static uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ROUTES
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/investments", require("./routes/investmentRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));   
app.use("/api/money-requests", moneyRequestRoutes);
app.use("/api/investments", require("./routes/investmentRoutes"));
app.use("/api/admin/investments", require("./routes/adminInvestmentRoutes"));




// START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
