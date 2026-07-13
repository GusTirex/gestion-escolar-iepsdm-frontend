import axios from "axios";

// Cliente HTTP central. La URL base viene de .env (VITE_API_URL).
// Asi, para apuntar a produccion solo se cambia el .env, no el codigo.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

const STORAGE = "iepsdm_auth";

// Devuelve el token JWT guardado al iniciar sesion (o null si no hay).
function tokenGuardado() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE))?.token || null;
  } catch {
    return null;
  }
}

// A cada peticion le adjunta el token para que el backend sepa quien la hace.
api.interceptors.request.use((config) => {
  const token = tokenGuardado();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Si el backend responde 401 (token expirado o invalido), cierra la sesion
// y manda al login. No aplica al propio login (ahi el 401 es "credenciales malas").
api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    const esLogin = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !esLogin) {
      localStorage.removeItem(STORAGE);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
