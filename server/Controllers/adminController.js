import Deadline from "../Models/Deadline.js";
import Submission from "../Models/Submission.js";
import Task from "../Models/Task.js";
import User from "../Models/User.js";

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

export const getAnalytics = async (req, res) => {
  try {
    // Get counts
    const totalTasks = await Task.countDocuments();
    const activeTasks = await Task.countDocuments({ status: "Active" });
    const closedTasks = await Task.countDocuments({ status: "Closed" });
    const totalUsers = await User.countDocuments({ role: "USER" });
    const totalSubmissions = await Submission.countDocuments();
    const onTimeSubmissions = await Submission.countDocuments({ status: "OnTime" });
    const lateSubmissions = await Submission.countDocuments({ status: "Late" });
    const missingSubmissions = await Submission.countDocuments({ status: "Missing" });

    // Get submission breakdown by task
    const submissionsByTask = await Submission.aggregate([
      {
        $group: {
          _id: "$task",
          count: { $sum: 1 },
          onTime: {
            $sum: { $cond: [{ $eq: ["$status", "OnTime"] }, 1, 0] }
          },
          late: {
            $sum: { $cond: [{ $eq: ["$status", "Late"] }, 1, 0] }
          }
        }
      },
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "_id",
          as: "taskInfo"
        }
      }
    ]);

    // Get recent activity
    const recentSubmissions = await Submission.find()
      .populate("user", "name email")
      .populate("task", "title")
      .sort({ submittedAt: -1 })
      .limit(10);

    res.json({
      summary: {
        totalTasks,
        activeTasks,
        closedTasks,
        totalUsers,
        totalSubmissions,
        onTimeSubmissions,
        lateSubmissions,
        missingSubmissions
      },
      submissionsByTask,
      recentActivity: recentSubmissions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
  }
};