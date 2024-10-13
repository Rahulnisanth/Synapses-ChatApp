import mongoose from "mongoose";

const channel_schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.ObjectId, ref: "Users", required: true }],
  admin: { type: mongoose.Schema.ObjectId, ref: "Users", required: true },
  messages: [
    { type: mongoose.Schema.ObjectId, ref: "Messages", required: false },
  ],
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

channel_schema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

channel_schema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Create and export Channel Schema
export const Channel = mongoose.model("Channels", channel_schema);
