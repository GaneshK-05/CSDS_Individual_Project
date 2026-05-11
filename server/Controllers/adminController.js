import Deadline from "../Models/Deadline.js";
import Submission from "../Models/Submission.js";

export const setDeadline = async (req, res) => {
  try {
    const { deadline } = req.body;

    if (!deadline) {
      return res.status(400).json({ message: "Deadline date is required" });
    }

    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }

    await Deadline.deleteMany();

    const newDeadline = await Deadline.create({
      deadline: deadlineDate
    });

    res.json({ message: "Deadline set successfully", deadline: newDeadline });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to set deadline", error: error.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("user", "name email")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
  }
};

export const getDeadline = async (req, res) => {
  try {
    const deadline = await Deadline.findOne();
    if (!deadline) {
      return res.status(404).json({ message: "No deadline set" });
    }
    res.json(deadline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch deadline", error: error.message });
  }
};