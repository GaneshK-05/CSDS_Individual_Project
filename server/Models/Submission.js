import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    submissionType: {
      type: String,
      enum: ["Text", "File"],
      required: true
    },
    content: {
      type: String  // For text submissions
    },
    file: {
      originalName: String,
      filename: String,
      path: String,
      size: Number,
      mimetype: String
    },
    status: {
      type: String,
      enum: ["OnTime", "Late", "Missing"],
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model("Submission", submissionSchema);