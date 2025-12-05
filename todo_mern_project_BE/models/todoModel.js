import mongoose from "mongoose";

const todoSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notebook: {
      type: String,
      default: "General",
    },
    status: {
      type: String,
      enum: ["pending", "completed", "deleted"],
      default: "pending",
    },
    taskCreatedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
