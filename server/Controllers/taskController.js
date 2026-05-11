import Task from "../Models/Task.js";
import Submission from "../Models/Submission.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      deadline,
      allowedFileTypes,
      maxFileSize,
      submissionType
    } = req.body;

    if (!title || !subject || !description || !deadline) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const task = await Task.create({
      title,
      subject,
      description,
      deadline: new Date(deadline),
      allowedFileTypes: allowedFileTypes || [
        "PDF",
        "DOC",
        "DOCX",
        "XLSX",
        "ZIP",
        "PNG",
        "JPG",
        "JPEG"
      ],
      maxFileSize: maxFileSize || 10,
      submissionType: submissionType || "Both",
      createdBy: req.user.id,
      status: "Active"
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create task", error: error.message });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("createdBy", "name email");
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch tasks", error: error.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("createdBy", "name email");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch task", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { title, subject, description, deadline, allowedFileTypes, maxFileSize, submissionType, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only admin/creator can update
    if (task.createdBy.toString() !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    if (title) task.title = title;
    if (subject) task.subject = subject;
    if (description) task.description = description;
    if (deadline) task.deadline = new Date(deadline);
    if (allowedFileTypes) task.allowedFileTypes = allowedFileTypes;
    if (maxFileSize) task.maxFileSize = maxFileSize;
    if (submissionType) task.submissionType = submissionType;
    if (status) task.status = status;

    await task.save();
    res.json({ message: "Task updated successfully", task });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to update task", error: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Only admin/creator can delete
    if (task.createdBy.toString() !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    // Delete associated submissions
    await Submission.deleteMany({ task: req.params.id });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to delete task", error: error.message });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const totalTasks = await Task.countDocuments();
    const activeTasks = await Task.countDocuments({ status: "Active" });
    const closedTasks = await Task.countDocuments({ status: "Closed" });

    const submissions = await Submission.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const stats = {
      totalTasks,
      activeTasks,
      closedTasks,
      submissions: {}
    };

    submissions.forEach(sub => {
      stats.submissions[sub._id] = sub.count;
    });

    res.json(stats);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: error.message });
  }
};
