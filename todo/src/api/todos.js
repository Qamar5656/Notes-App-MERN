import apiClient from "./apiClient";

export const fetchTodos = () => apiClient.get("/todos");

export const createTodo = (data) => apiClient.post("/create-todo", data);

export const updateTodo = (id, data) => apiClient.put(`/todos/${id}`, data);

export const deleteTodo = (id) => apiClient.delete(`/todos/${id}`);

export const markTodoCompleted = (id) =>
  apiClient.put(`/todos/${id}/completed`);

export const filterTodosByPriority = (priority) =>
  apiClient.get(`/todos?priority=${priority}`);
