const PORT = process.env.PORT || 5000;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes_tem/auth");
const blogRoutes = require("./routes_tem/blogs");
require("dotenv").config();

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/blogbackend")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

module.exports = app;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
