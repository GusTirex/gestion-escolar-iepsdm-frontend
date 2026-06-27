import axios from "axios";

// Cliente HTTP central. La URL base viene de .env (VITE_API_URL).
// Asi, para apuntar a produccion solo se cambia el .env, no el codigo.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export default api;
