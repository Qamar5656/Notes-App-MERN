// hooks/useTodos.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import * as todoService from "../services/todoService";

export const useTodos = (filter = "") => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  // Convert sidebar filter to API query
  const getQueryFromFilter = (filter) => {
    if (!filter) return "status!=deleted"; // Default: show all active tasks

    if (filter === "Tasks") return "status!=deleted"; // All active tasks
    if (filter === "Completed") return "status=completed";
    if (filter === "Trash") return "status=deleted";

    if (filter.startsWith("Notebook > ")) {
      const notebookName = filter.split("> ")[1];
      return `notebook=${notebookName}&status!=deleted`;
    }

    if (filter.startsWith("Priority: ")) {
      const priority = filter.split(": ")[1].toLowerCase();
      return `priority=${priority}&status!=deleted`;
    }

    return filter;
  };

  // Fetch todos based on filter
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const query = getQueryFromFilter(filter);
      const data = await todoService.fetchTodos(query);
      setTodos(data || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
      toast.error("Failed to fetch todos");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Load todo statistics
  const loadStats = useCallback(async () => {
    try {
      const statsData = await todoService.fetchTodoStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  // Refresh todos manually
  const refreshTodos = () => {
    loadTodos();
    loadStats(); // Also refresh stats
  };

  // Delete a todo (soft delete)
  const deleteTask = async (id) => {
    try {
      await todoService.deleteTodo(id);
      refreshTodos(); // Refresh after delete
      toast.success("Task moved to trash");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Unable to delete task");
    }
  };

  // Permanent delete from trash
  const permanentDeleteTask = async (id) => {
    try {
      await todoService.permanentDeleteTodo(id);
      refreshTodos();
      toast.success("Task permanently deleted");
    } catch (error) {
      console.error("Error permanently deleting task:", error);
      toast.error("Unable to delete task permanently");
    }
  };

  // Restore from trash
  const restoreTask = async (id) => {
    try {
      await todoService.restoreTodo(id);
      refreshTodos();
      toast.success("Task restored from trash");
    } catch (error) {
      console.error("Error restoring task:", error);
      toast.error("Unable to restore task");
    }
  };

  // Update a todo
  const updateTask = async (id, updatedData) => {
    try {
      const res = await todoService.updateTodo(id, updatedData);
      refreshTodos();
      toast.success("Task updated successfully");
      return res.data.todo;
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Unable to update task");
      throw error;
    }
  };

  // Mark a todo as completed
  const completeTask = async (id) => {
    try {
      await todoService.markCompleted(id);
      refreshTodos();
      toast.success("Task marked as completed");
    } catch (error) {
      console.error("Error completing task:", error);
      toast.error("Unable to complete task");
    }
  };

  // Load todos when filter changes
  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    todos,
    loading,
    stats,
    deleteTask,
    permanentDeleteTask,
    restoreTask,
    updateTask,
    completeTask,
    refreshTodos,
  };
};
