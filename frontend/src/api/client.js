import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://scsu-lost-found-backend-cma4hucnhydvh4dv.eastus2-01.azurewebsites.net"; // safe fallback

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // cookies / auth
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("lf_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
