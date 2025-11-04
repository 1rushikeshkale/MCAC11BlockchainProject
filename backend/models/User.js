// backend/models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    prn: {
      type: String,
      required: true,
      unique: true,
      match: [/^\d{16}$/, "PRN must be exactly 16 digits"],
    },

    // ✅ total credits
    totalCredits: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema, "users");
