import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    deadline: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ["Active", "Closed"],
      default: "Active"
    },
    allowedFileTypes: {
      type: [String],
      default: ["PDF", "DOC", "DOCX", "XLSX", "ZIP", "PNG", "JPG", "JPEG"],
      validate: {
        validator: function(v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: "At least one file type must be allowed"
      }
    },
    maxFileSize: {
      type: Number, // in MB
      default: 10
    },
    submissionType: {
      type: String,
      enum: ["Text", "File", "Both"],
      default: "Both"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Task", taskSchema);
