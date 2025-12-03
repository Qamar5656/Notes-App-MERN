import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Separate client for refresh token request to avoid interceptor loops
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// Request interceptor to add access token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token errors (401/403)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403) &&
      error.response.data?.message?.toLowerCase().includes("token") &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/signin";
        return Promise.reject(error);
      }

      try {
        const res = await refreshClient.post("/refresh-token", {
          refreshToken,
        });
        localStorage.setItem("accessToken", res.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return apiClient(originalRequest); // Retry original request
      } catch (refreshError) {
        console.error(
          "Token refresh failed:",
          refreshError.response?.data || refreshError.message
        );
        localStorage.clear();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
