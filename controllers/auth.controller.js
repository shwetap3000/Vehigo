const User = require("../models/auth.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { success } = require("zod");

const registerController = async (req, res) => {
  const { username, email, password, number, address } = req.body;
  try {
    if (!username || !email || !password || !number) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists!",
        success: false,
      });
    }
    const newUser = await User.create({
      username,
      email,
      password,
      number,
      address: address || "",
    });
    if (!newUser) {
      return res.status(500).json({
        message: "Something went wrong!",
        success: false,
      });
    }
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", token, cookieOptions);
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      user: newUser,
    });
    // Removed res.redirect("/") - can't send both JSON and redirect
  } catch (error) {
    console.log("Error creating new user: ", error.message);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body: ", req.body);
  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User doesn't exist!",
        success: false,
      });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(401).json({
        message: "Email or password is incorrect!",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Login successfully",
      success: true,
      user,
    });
    // Removed res.redirect("/") - can't send both JSON and redirect
  } catch (error) {
    console.log("Error logging the user: ", error.message);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

const logoutController = async (req, res) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: false, // Set to false for localhost
      sameSite: "Lax",
      maxAge: 24 * 60 * 60 * 1000,
    };
    res.cookie("token", " ", cookieOptions);
    return res.status(200).json({
      message: "Logout successfully!",
      success: true,
    });
  } catch (error) {
    console.log("Error logging out: ", error.message);
    return res.status(500).json({
      message: "Something went wrong!",
      success: false,
    });
  }
};

const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Forgot Password request (send reset link)
const forgotPasswordController = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Save token & expiry to user (valid 15 mins)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save({ validateBeforeSave: false });

        // Create reset URL
        const resetUrl = `http://localhost:4000/auth/reset-password/${resetToken}`;

        // Send email (using nodemailer)
        const transporter = nodemailer.createTransport({
            service: "gmail", // or SMTP config
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset Request",
            html: `<p>You requested to reset password.</p>
                   <p>Click <a href="${resetUrl}">here</a> to reset password.</p>`
        });

        return res.status(200).json({ message: "Password reset link sent to email", success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error", success: false });
    }
};

// Reset Password (via Token)
const resetPasswordController = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token", success: false });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset token & expiry
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful!", success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error", success: false });
    }
};

module.exports = { registerController, loginController, logoutController, forgotPasswordController, resetPasswordController };

