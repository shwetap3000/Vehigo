require('dotenv').config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();

connectDB();

app.use(cors({
  origin: 'http://127.0.0.1:5503',  // Update if you use different port for serving frontend
  credentials: true
}));

app.use(express.json());

// Mount auth routes under /api/auth
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
