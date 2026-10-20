import axios from "axios";

export const API_ORIGIN =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_ORIGIN.replace(/\/+$/, "")}/api`,
  // Enable this if your backend uses cookie-based sessions.
  // withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const errorMessage = (err) => {
  if (err.response?.data?.message) {
    return err.response.data.message;
  }

  if (err.response?.status) {
    return `Request failed (${err.response.status}). Please try again.`;
  }

  return err.message || "Cannot connect to the server. Check that Spring Boot is running.";
};

export default api;
