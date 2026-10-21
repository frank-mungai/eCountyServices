import axios from "axios";

export const API_ORIGIN =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const api = axios.create({
  baseURL: `${API_ORIGIN.replace(/\/+$/, "")}/api`,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const errorMessage = (err) => {
  const data = err.response?.data;

  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors).join(" ");
  }

  if (data?.message) {
    return data.message;
  }

  if (err.response?.status) {
    return `Request failed (${err.response.status}). Please try again.`;
  }

  return (
    err.message ||
    "Cannot connect to the server. Check your internet connection."
  );
};

export default api;