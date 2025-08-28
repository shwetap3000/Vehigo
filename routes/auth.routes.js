const express = require("express");
const {
  registerController,
  loginController,
  logoutController,
  forgotPasswordController,
  resetPasswordController
} = require("../controllers/auth.controller.js");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware.js");

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/logout", isAuthenticated, logoutController);

// Forgot password routes
authRouter.post("/forgot-password", forgotPasswordController); // email with token
authRouter.post("/reset-password/:token", resetPasswordController); // reset password

module.exports = authRouter;
21145