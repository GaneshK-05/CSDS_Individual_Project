import Submission from "../Models/Submission.js";
import Deadline from "../Models/Deadline.js";

export const submitEntry = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const deadlineData = await Deadline.findOne();

    if (!deadlineData)
      return res.status(400).json({ message: "Deadline not set" });

    if (new Date() > deadlineData.deadline)
      return res.status(403).json({ message: "Deadline has passed" });

    const submission = await Submission.create({
      user: req.user.id,
      content
    });

    res.status(201).json({ message: "Submission successful", submission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Submission failed", error: error.message });
  }
};

export const mySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id }).sort({ submittedAt: -1 });
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch submissions", error: error.message });
  }
};