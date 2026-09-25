import mongoose from "mongoose";

const executionSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    status: {
      type: String,
      enum: ["Success", "Failed"],
      default: "Success",
    },
    attempts: [
      {
        _id: false,
        attempt: Number,
        statusCode: Number,
        message: String,
        responseTime: Number,
      },
    ],
  },
  { timestamps: true }
);

export const Execution = mongoose.model("Execution", executionSchema);
