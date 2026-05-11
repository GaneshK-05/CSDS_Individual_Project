import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema(
  {
    deadline: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Deadline", deadlineSchema);