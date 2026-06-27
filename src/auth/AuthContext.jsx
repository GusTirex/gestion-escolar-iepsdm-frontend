import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const STORAGE = "iepsdm_auth";

export const HOME_BY_ROLE = {
  ESTUDIANTE: "/estudiante",
  DOCENTE: "/docente",
  PADRE: "/padre",
  ADMIN: "/admin",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE)) || null;
    } catch {
      return null;
    }
  });

  const iniciarSesion = (u) => {
    setUser(u);
    localStorage.setItem(STORAGE, JSON.stringify(u));
  };

  const cerrarSesion = () => {
    setUser(null);
    localStorage.removeItem(STORAGE);
  };

  return (
    <AuthContext.Provider value={{ user, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
