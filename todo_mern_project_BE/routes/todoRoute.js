import express from "express";
import {
  createTodo,
  getTodos,
  updateTodos,
  DeleteTodo,
  permanentDeleteTodo,
  markAsCompleted,
  restoreTodo,
  getTodoStats,
} from "../controllers/todoController.js";
import { authenticateUser } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// All routes protected
router.post("/create-todo", authenticateUser, createTodo);
router.get("/todos", authenticateUser, getTodos); //
router.put("todos/:id", authenticateUser, updateTodos);
router.delete("/todos/:id", authenticateUser, DeleteTodo);
router.delete("/todos/:id/permanent", authenticateUser, permanentDeleteTodo);
router.patch("/todos/:id/complete", authenticateUser, markAsCompleted);
router.patch("/todos/:id/restore", authenticateUser, restoreTodo);
router.get("/todos/stats", authenticateUser, getTodoStats);

export default router;
