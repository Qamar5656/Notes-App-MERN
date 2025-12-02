import express from "express";
import {
  createTodo,
  DeleteTodo,
  getTodos,
  updateTodos,
} from "../controllers/todoController.js";

const router = express.Router();

//routes
router.post("/create-todo", createTodo);
router.get("/todos", getTodos);
router.put("/todos/:id", updateTodos);
router.delete("/todos/:id", DeleteTodo);

export default router;
