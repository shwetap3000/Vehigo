const express = require("express");
const { registerController, loginController, logoutController } = require("../controllers/auth.controller.js");
const isAuthenticated = require("../middlewares/isAuthenticated.middleware.js");

const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/logout",isAuthenticated, logoutController);

module.exports = authRouter;
21145