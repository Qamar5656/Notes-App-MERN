// hooks/useTodos.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import * as todoService from "../services/todoService";

export const useTodos = (initialFilter = "") => {
  const [todos, setTodos] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState(initialFilter);

  // Convert filter to query
  const getQueryFromFilter = (filter) => {
    if (!filter || filter === "Tasks") return "status=pending";
    if (filter === "Completed") return "status=completed";
    if (filter === "Trash") return "status=deleted";
    if (filter.startsWith("Priority: ")) {
      const priority = filter.split(": ")[1].toLowerCase();
      return `priority=${priority}&status!=deleted`;
    }
    return filter;
  };

  //Load Todos api call
  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);

      const params = { page, limit };

      // Filter mapping
      if (!filter || filter === "Tasks") params.status = "pending";
      else if (filter === "Completed") params.status = "completed";
      else if (filter === "Trash") params.status = "deleted";
      else if (filter.startsWith("Priority: ")) {
        params.priority = filter.split(": ")[1].toLowerCase();
        params.status = "pending";
      }

      const data = await todoService.fetchTodos(params);

      // THIS IS WHERE pagination data is set
      setTodos(data.todos || []); //  update todos for current page
      setTotalPages(data.totalPages || 1); // set total pages returned by backend
    } catch (error) {
      console.error("Failed to load todos", error);
      toast.error("Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, [filter, page, limit]);

  const loadStats = useCallback(async () => {
    try {
      const statsData = await todoService.fetchTodoStats();
      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  const refreshTodos = () => {
    loadTodos();
    loadStats();
  };

  //Add task
  const addTodoOptimistic = async (newTodo) => {
    if (!newTodo.task || !newTodo.description || !newTodo.priority) return;

    const tempId = Date.now();
    const optimisticTodo = {
      ...newTodo,
      _id: tempId,
      status: "pending",
      createdAt: new Date(),
    };

    // Add temp todo but slice to limit to not overflow page
    setTodos((prev) => [optimisticTodo, ...(prev || [])].slice(0, limit));

    try {
      const response = await todoService.createTodo(newTodo);
      const savedTodo = response.data?.data;
      if (!savedTodo) throw new Error("Invalid server response");

      // Replace temp todo
      setTodos((prev) => [
        savedTodo,
        ...(prev || []).filter((todo) => todo._id !== tempId),
      ]);
    } catch (error) {
      setTodos((prev) => (prev || []).filter((todo) => todo._id !== tempId));
      toast.error(error.response?.data?.message || "Failed to add task");
    }
  };

  // Debounced search
  const searchTodos = async (query) => {
    try {
      if (!query) {
        refreshTodos();
        return;
      }
      setLoading(true);
      const data = await todoService.searchTodo(query);
      setTodos(data || []);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  // CRUD actions
  const deleteTask = async (id) => {
    try {
      await todoService.deleteTodo(id);
      refreshTodos();
      toast.success("Task moved to trash");
    } catch (error) {
      toast.error("Unable to delete task");
    }
  };

  const restoreTask = async (id) => {
    try {
      await todoService.restoreTodo(id);
      refreshTodos();
      // toast.success("Task restored");
    } catch (error) {
      toast.error("Unable to restore task");
    }
  };

  const permanentDeleteTask = async (id) => {
    try {
      await todoService.permanentDeleteTodo(id);
      refreshTodos();
      toast.success("Task permanently deleted");
    } catch (error) {
      toast.error("Unable to delete task permanently");
    }
  };

  //Update api call
  const updateTask = async (id, updatedData) => {
    try {
      await todoService.updateTodo(id, updatedData);
      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, ...updatedData } : todo
        )
      );
      return true; // <- important for AddTodo
    } catch (error) {
      toast.error("Unable to update task");
      throw error; // <- so AddTodo catch works
    }
  };

  const completeTask = async (id) => {
    try {
      await todoService.markCompleted(id);
      refreshTodos();
      toast.success("Task marked as completed");
    } catch (error) {
      toast.error("Unable to complete task");
    }
  };

  useEffect(() => {
    loadTodos(filter);
  }, [filter, loadTodos]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return {
    todos,
    loading,
    stats,
    filter,
    page,
    totalPages,
    setFilter,
    setPage,
    refreshTodos,
    addTodoOptimistic,
    searchTodos,
    deleteTask,
    restoreTask,
    permanentDeleteTask,
    updateTask,
    completeTask,
  };
};
