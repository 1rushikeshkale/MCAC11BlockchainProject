// backend/models/Credit.js
import mongoose from "mongoose";

const CreditSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    studentName: { type: String },
    studentEmail: { type: String, default: "" },
    prn: { type: String, default: "" },
    platform: { type: String, default: "" },
    courseName: { type: String, required: true },
    duration: { type: String, required: true }, // "4" | "8" | "12"
    credits: { type: Number, required: true },
    certificateUrl: { type: String, required: true },

    // ✅ Added type field (normalized lowercase)
    creditType: {
      type: String,
      enum: ["internal", "external"],
      required: true,
      default: "external",
    },

    status: {
      type: String,
      enum: ["Pending", "Requested", "Approved", "Rejected", "Verified"],
      default: "Pending",
    },
    rejectReason: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Credit", CreditSchema, "credits");
