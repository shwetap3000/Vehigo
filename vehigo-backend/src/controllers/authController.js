const authService = require('../services/authService');
const { z } = require('zod');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const CLIENT_URL = process.env.CLIENT_URL || 'http://127.0.0.1:5503';

exports.signup = async (req, res) => {
  const schema = z.object({
    name: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(6).max(12).optional(),
    firebase_uid: z.string().optional(),
    auth_provider: z.enum(['google', 'email']),
    phone_number: z.string().regex(/^\d{10}$/),
    address: z.string().max(50).optional(),
  });
  try {
    const validated = schema.parse(req.body);
    const { user, token } = await authService.register(validated);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ message: error.message, errors: error.errors || null });
  }
};

exports.login = async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    auth_provider: z.enum(['google', 'email']),
    password: z.string().min(6).max(12).optional(),
    firebase_uid: z.string().optional(),
  });
  try {
    const validated = schema.parse(req.body);
    let data;
    if (validated.auth_provider === 'email') {
      if (!validated.password) throw new Error('Password required');
      data = await authService.loginWithEmail(validated.email, validated.password);
    } else {
      if (!validated.firebase_uid) throw new Error('Firebase UID required');
      data = await authService.loginWithGoogle(validated.email, validated.firebase_uid);
    }
    res.json({ user: data.user, token: data.token });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.logout = (req, res) => {
  // JWT logout handled at client
  res.json({ message: 'Logged out successfully' });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email, auth_provider: 'email' });
    if (!user) return res.json({ message: 'If email registered, reset link sent' });

    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(token).digest('hex');

    user.resetPasswordToken = hash;
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetURL = `${CLIENT_URL}/src/pages/reset-password.html?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Reset your password <a href="${resetURL}">here</a>. Valid for 15 minutes.</p>`
    });

    res.json({ message: 'Reset link sent' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password || password.length < 6 || password.length > 12) {
    return res.status(400).json({ message: "Password must be 6-12 characters." });
  }

  const hash = require('crypto').createHash('sha256').update(token).digest('hex');

  try {
    const user = await require('../models/User').findOne({
      resetPasswordToken: hash,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const bcrypt = require('bcryptjs');
    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    return res.status(500).json({ message: "Server error." });
  }
};


exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, 'name email phone_number address auth_provider');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user, message: 'Profile fetched' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.body.password && user.auth_provider !== 'email')
      return res.status(400).json({ message: 'Password change allowed only for email auth' });

    Object.assign(user, req.body);
    await user.save();

    res.json({ message: 'Profile updated', user });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};
