
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
  timeout: 120000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("workvault_access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
