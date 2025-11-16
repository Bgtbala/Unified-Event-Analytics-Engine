import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    app: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "App",
      required: true,
      index: true,
    },
    apiKey: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ApiKey",
      required: true,
    },

    event: { type: String, required: true, index: true },

    url: { type: String },
    referrer: { type: String },
    device: { type: String },
    ipAddress: { type: String },
    userId: { type: String }, // optional unique user identifier

    timestamp: { type: Date, required: true, default: Date.now },

    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// 🔥 Common query optimization indexes
EventSchema.index({ app: 1, event: 1, timestamp: -1 });
EventSchema.index({ app: 1, userId: 1, timestamp: -1 });

export default mongoose.model("Event", EventSchema);
