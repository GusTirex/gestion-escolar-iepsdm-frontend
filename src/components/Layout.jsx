import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Sidebar from "./Sidebar";
import ChatWidget from "./ChatWidget";
import NotificacionesBell from "./NotificacionesBell";
import "./Layout.css";

function Layout() {
  const { user } = useAuth();
  const logueado = ["ESTUDIANTE", "DOCENTE", "PADRE", "ADMIN"].includes(user?.rol);
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content">
        <Outlet />
      </main>
      {logueado && <NotificacionesBell />}
      {logueado && <ChatWidget />}
    </div>
  );
}

export default Layout;
