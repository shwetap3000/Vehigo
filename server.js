const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth.routes");
const db = require("./utils/database");
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files (css, js, images, etc.)
app.use(express.static(path.join(__dirname)));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Serve login page from src/pages directory
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "src/pages/login.html"));
});

// Serve signup page from src/pages directory
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "src/pages/login.html"));
});

app.use("/", authRouter);

db();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App is listening to port: ${PORT}`);
});
