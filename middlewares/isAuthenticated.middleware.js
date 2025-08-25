const User = require("../models/auth.model.js");
const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies?.token;
  // console.log("token inside of middleware: ", token);
  try {
    if (!token) {
      return res.status(404).json({
        message: "Please login!",
        success: false,
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoddedtoken: ", decodedToken);
    const user = await User.findById({ _id: decodedToken.id });
    if (!user) {
      return res.status(404).json({
        message: "Please login!",
        success: false,
      });
    }
    req.userId = user._id;
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({
      message: "Invalid token or authentication failed",
      success: false,
    });
  }
};

module.exports = isAuthenticated;
