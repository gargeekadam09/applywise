const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const jobRoutes = require("./routes/jobRoutes");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads")); // Serve uploaded files
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/documents", documentRoutes);

console.log("Routes registered: /api/auth, /api/jobs, /api/documents");

app.get("/", (req, res) => {
  res.send("ApplyWise Backend Running...");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is running with resume routes!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

