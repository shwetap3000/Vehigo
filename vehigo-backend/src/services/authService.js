const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const register = async (data) => {
  const { name, email, auth_provider, phone_number, address } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("User already exists");

  let newUser;
  if (auth_provider === "email") {
    const password = data.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      phone_number,
      auth_provider,
      address,
    });
  } else if (auth_provider === "google") {
    const firebase_uid = data.firebase_uid;
    newUser = await User.create({
      name,
      email,
      firebase_uid,
      auth_provider,
      phone_number,
      address,
    });
  }

  return { user: newUser, token: generateToken(newUser) };
};

const loginWithEmail = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || user.auth_provider !== "email") throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  return { user, token: generateToken(user) };
};

const loginWithGoogle = async (email, firebase_uid) => {
  const user = await User.findOne({ email });
  if (!user || user.auth_provider !== "google") throw new Error("Invalid credentials");

  if (user.firebase_uid !== firebase_uid) throw new Error("Invalid credentials");

  return { user, token: generateToken(user) };
};

module.exports = { register, loginWithEmail, loginWithGoogle };
