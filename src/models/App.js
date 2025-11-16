import mongoose from "mongoose";

const AppSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    domain: { type: String },
    ownerUserId: { type: String }, // optional for Google Auth onboarding
  },
  { timestamps: true }
);

export default mongoose.model("App", AppSchema);
