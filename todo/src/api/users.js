import apiClient from "./apiClient";

export const fetchUsers = () => apiClient.get("/users");
export const createUser = (data) => apiClient.post("/register", data);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);
export const SignInUser = (data) => apiClient.post("/signin", data);
export const verifyOtp = (data) => apiClient.post("/verify-otp", data);
export const resendOtp = (data) => apiClient.post("/resend-otp", data);
export const forgetPassword = (data) =>
  apiClient.post("/forgot-password", data);
export const resetPassword = (data) => apiClient.post("/reset-password", data);
export const refreshAccessToken = (refreshToken) =>
  apiClient.post("/refresh-token", { refreshToken });
