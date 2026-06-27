import { createContext, useContext } from "react";

// Contexto, constantes y hook de autenticacion (sin componentes).
// El componente AuthProvider vive en AuthProvider.jsx.
export const AuthContext = createContext(null);

export const HOME_BY_ROLE = {
  ESTUDIANTE: "/estudiante",
  DOCENTE: "/docente",
  PADRE: "/padre",
  ADMIN: "/admin",
};

export function useAuth() {
  return useContext(AuthContext);
}
