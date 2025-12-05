// services/todoService.js
import apiClient from "../api/apiClient";

export const fetchTodos = async (params = {}) => {
  // Convert object to query string
  const queryString = new URLSearchParams(params).toString();
  const res = await apiClient.get(
    `/todos${queryString ? `?${queryString}` : ""}`
  );
  return res.data; // return full data: { todos, filters }
};

// Fetch todo stats for sidebar counters
export const fetchTodoStats = async () => {
  const res = await apiClient.get("/todos/stats");
  return res.data.stats;
};

// Create todo
export const createTodo = (data) => apiClient.post("/create-todo", data);

// Update Service
export const updateTodo = async (id, data) => {
  try {
    const response = await apiClient.put(`/todos/${id}`, data);

    return response;
  } catch (error) {
    console.error("Update service error:", error);
    throw error;
  }
};

//search todo
export const searchTodo = async (query) => {
  const res = await apiClient.get(`/todos${query ? `?search=${query}` : ""}`);
  return res.data.todos;
};

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
