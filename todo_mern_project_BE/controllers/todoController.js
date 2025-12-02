import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  //Todo Fields
  task: { type: String, required: true },
  priority: { type: String, required: true },
  description: { type: String, required: true },

  taskCreatedAt: { type: Date },
});

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
