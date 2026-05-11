import Submission from "../Models/Submission.js";
import Task from "../Models/Task.js";
import fs from "fs";
import path from "path";

export const submitTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { submissionType, content } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if task is still active
    if (task.status !== "Active") {
      return res.status(400).json({ message: "Task is closed for submissions" });
    }

    // Check for existing submission
    const existingSubmission = await Submission.findOne({
      task: taskId,
      user: req.user.id
    });

    if (existingSubmission) {
      return res.status(400).json({ message: "You have already submitted this task" });
    }

    const now = new Date();
    const deadline = new Date(task.deadline);
    const status = now <= deadline ? "OnTime" : "Late";

    let submission;

    if (submissionType === "Text") {
      if (!content || content.trim() === "") {
        return res.status(400).json({ message: "Content is required for text submission" });
      }

      submission = await Submission.create({
        task: taskId,
        user: req.user.id,
        submissionType: "Text",
        content,
        status,
        submittedAt: now
      });
    } else if (submissionType === "File") {
      if (!req.file) {
        return res.status(400).json({ message: "File is required for file submission" });
      }

      // Validate file type
      const fileExt = path.extname(req.file.originalname).substring(1).toUpperCase();
      if (!task.allowedFileTypes.includes(fileExt)) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          message: `File type ${fileExt} is not allowed. Allowed types: ${task.allowedFileTypes.join(", ")}`
        });
      }

      // Validate file size (convert bytes to MB)
      const fileSizeMB = req.file.size / (1024 * 1024);
      if (fileSizeMB > task.maxFileSize) {
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          message: `File size exceeds limit of ${task.maxFileSize}MB`
        });
      }

      submission = await Submission.create({
        task: taskId,
        user: req.user.id,
        submissionType: "File",
        file: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
          mimetype: req.file.mimetype
        },
        status,
        submittedAt: now
      });
    }

    res.status(201).json({
      message: `Submission ${status === "OnTime" ? "successful" : "received as late"}`,
      submission
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    console.error(error);
    res
      .status(500)
      .json({ message: "Submission failed", error: error.message });
  }
};

export const getUserSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ user: req.user.id })
      .populate("task", "title subject deadline")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch submissions", error: error.message });
  }
};

export const getTaskSubmissions = async (req, res) => {
  try {
    const { taskId } = req.params;

    const submissions = await Submission.find({ task: taskId })
      .populate("user", "name email")
      .populate("task", "title deadline")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch submissions", error: error.message });
  }
};

export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find()
      .populate("user", "name email")
      .populate("task", "title subject deadline")
      .sort({ submittedAt: -1 });

    res.json(submissions);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch submissions", error: error.message });
  }
};

export const downloadSubmissionFile = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId);
    if (!submission || !submission.file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = submission.file.path;
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    res.download(filePath, submission.file.originalName);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to download file", error: error.message });
  }
};
