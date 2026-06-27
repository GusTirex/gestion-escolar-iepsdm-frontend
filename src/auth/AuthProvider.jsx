import { useState } from "react";
import { AuthContext } from "./AuthContext";

const STORAGE = "iepsdm_auth";

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
