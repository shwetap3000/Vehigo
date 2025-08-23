const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: function () { return this.auth_provider === "email"; } },
  firebase_uid: {
    type: String,
    unique: true,
    sparse: true,  // IMPORTANT for null values to not cause duplicate errors
    required: function() { return this.auth_provider === "google"; }
  },
  auth_provider: { type: String, enum: ["google", "email"], required: true },
  phone_number: {
    type: String,
    validate: {
      validator: (v) => /^\d{10}$/.test(v),
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  address: { type: String, trim: true },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
