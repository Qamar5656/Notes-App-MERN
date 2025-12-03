// services/todoService.js
import apiClient from "../api/apiClient";

// Fetch todos with query parameters
export const fetchTodos = async (query = "") => {
  const res = await apiClient.get(`/todos${query ? `?${query}` : ""}`);
  return res.data.todos;
};

// Fetch todo stats for sidebar counters
export const fetchTodoStats = async () => {
  const res = await apiClient.get("/todos/stats");
  return res.data.stats;
};

// Create todo
export const createTodo = (data) => apiClient.post("/create-todo", data);

// Update todo
export const updateTodo = (id, data) => apiClient.put(`/todos/${id}`, data);

// Delete todo (soft delete to trash)
export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`);

// Mark as completed
export const markCompleted = async (id) => {
  return apiClient.patch(`/todos/${id}/complete`, {});
};

// Restore from trash
export const restoreTodo = (id) => apiClient.patch(`/todos/${id}/restore`, {});

// Permanent delete
export const permanentDeleteTodo = (id) =>
  apiClient.delete(`/todos/${id}/permanent`);

// Get todos by priority (for priority filtering)
export const filterTodosByPriority = (priority) =>
  apiClient.get(`/todos?priority=${priority}`);
