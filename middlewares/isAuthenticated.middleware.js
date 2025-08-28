const User = require("../models/auth.model.js");
const jwt = require("jsonwebtoken");
const path = require("path");

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token;

  try {
    if (!token) {
      return res.status(401).sendFile(path.join(__dirname, "../404.html"));
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.id);
    if (!user) {
      return res.status(401).sendFile(path.join(__dirname, "../404.html"));
    }

    req.userId = user._id;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).sendFile(path.join(__dirname, "../404.html"));
  }
};

module.exports = isAuthenticated;
