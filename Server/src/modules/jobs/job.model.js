import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    jobName: {
      type: String,
      required: [true, "Job name is required."],
    },
    url: {
      type: String,
      required: [true, "url is required."],
      trim: true,
    },
    method: {
      type: String,
      enum: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      default: "GET",
    },
    headers: {
      type: mongoose.Schema.Types.Mixed,
    },
    body: {
      type: mongoose.Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: ["Active", "Paused"],
      default: "Active",
    },
    monitorInterval: {
      type: Number,
      enum: [5, 30, 60, 300, 600, 1800],
      default: 300,
    },
    nextRunAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
