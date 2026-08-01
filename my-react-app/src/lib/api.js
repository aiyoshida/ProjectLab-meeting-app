import axios from "axios";

export const API = process.env.REACT_APP_API_BASE_URL || "http://localhost:8787";
export const FRONT = process.env.REACT_APP_FRONT_BASE_URL || window.location.origin;

// Axios is a singleton, so this applies authentication to all existing API calls.
axios.interceptors.request.use((config) => {
  if (typeof config.url === "string" && config.url.startsWith(API)) {
    const token = localStorage.getItem("googleIdToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
