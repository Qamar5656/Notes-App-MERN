import express from "express";
import { createTodo, getTodos } from "../controllers/todoController.js";

const router = express.Router();

//routes
router.post("/create-todo", createTodo);
router.get("/todos", getTodos);

export default router;
