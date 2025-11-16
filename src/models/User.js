// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, index: true },
    email: { type: String, required: true, index: true, unique: true },
    name: String,
    avatar: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
