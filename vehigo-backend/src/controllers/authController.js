const authService = require("../services/authService");
const {z} =require("zod")
const User=require("../models/User")


exports.signup = async (req, res) => {
  const UserSchema=z.object({
    name:z.string().min(1).max(50),
    email:z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {message: "Invalid email format"}),
    password:z.string().min(6).max(12).optional(),
    firebase_uid:z.string().optional(),
    auth_provider:z.enum(['google','email']),
    phone_number:z.string().regex(/^\d{10}$/,{message:'Invalid phone number'}),
    address:z.string().min(1).max(50)
  })
  try {
    const response =UserSchema.safeParse(req.body)
    if (!response.success) return res.status(400).json({message:"Validation failed",errors:response.error.errors})
    const { user, token } = await authService.register(response.data);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const UserSchema = z.object({
    email: z.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" }),
    auth_provider: z.enum(['google', 'email']),
    password: z.string().min(6).max(12).optional(),
    firebase_uid: z.string().optional()
  });

  try {
    const response = UserSchema.safeParse(req.body);
    if (!response.success) {
      return res.status(400).json({ message: "Validation failed", errors: response.error.errors });
    }

    const { email, password, auth_provider, firebase_uid } = response.data;
    let user, token;

    if (auth_provider === 'email') {
      if (!password) {
        return res.status(400).json({ message: "Password is required for email login" });
      }
      ({ user, token } = await authService.loginWithEmail(email, password));
    } else {
      if (!firebase_uid) {
        return res.status(400).json({ message: "Firebase UID is required for Google login" });
      }
      ({ user, token } = await authService.loginWithGoogle(email, firebase_uid));
    }

    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

exports.logout = async (req, res) => {
  // With JWT, logout is handled client-side (by deleting token)
  res.status(200).json({ message: "Logged out successfully" });
};

exports.updateProfile = async (req, res) => {
  const UpdateUserSchema = z.object({
    name: z.string().min(1).max(50).optional(),
    phone_number: z.string().regex(/^\d{10}$/, { message: "Invalid phone number" }).optional(),
    address: z.string().min(1).max(50).optional(),
    password: z.string().min(6).max(12).optional()
  });

  try {
    // Validate input
    const validation = UpdateUserSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ message: "Validation failed", errors: validation.error.errors });
    }

    // Find the user
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If password update is requested for google auth
    if (validation.data.password && user.auth_provider !== "email") {
      return res.status(400).json({ message: "Password can only be updated for email auth users" });
    }

    // Update fields
    Object.assign(user, validation.data);

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    // Find the authenticated user using ID from JWT middleware
    const user = await User.findById(req.user.id).select(
      "name email phone_number address auth_provider createdAt updatedAt"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


