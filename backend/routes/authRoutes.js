// backend/routes/authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// 🔹 Debug route
router.get("/test", (req, res) => {
  res.json({ msg: "✅ Auth routes working" });
});

// 🔹 Register
router.post("/register", async (req, res) => {
  try {
    console.log("📩 Register Request Body:", req.body);

    const { name, email, password, prn } = req.body;
    if (!name || !email || !password || !prn) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ PRN validation (exactly 16 digits)
    if (!/^\d{16}$/.test(prn)) {
      return res.status(400).json({ msg: "PRN must be exactly 16 digits" });
    }

    // Check if email already registered
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ msg: "User with this email already registered" });
    }

    // Check if PRN already registered
    const existingPrn = await User.findOne({ prn });
    if (existingPrn) {
      return res.status(400).json({ msg: "User with this PRN already registered" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Save user
    const user = new User({ name, email, password: hashed, prn });
    await user.save();

    res.json({ msg: "✅ Registration successful", user });
  } catch (err) {
    console.error("❌ Register Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔹 Login
router.post("/login", async (req, res) => {
  try {
    console.log("📩 Login Request Body:", req.body);

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // ✅ Return PRN also
    res.json({
      msg: "✅ Login successful",
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        prn: user.prn 
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

export default router;
