import { Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Sidebar from "./Sidebar";
import ChatWidget from "./ChatWidget";
import "./Layout.css";

function Layout() {
  const { user } = useAuth();
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content">
        <Outlet />
      </main>
      {user?.rol === "ESTUDIANTE" && <ChatWidget />}
    </div>
  );
}

export default Layout;
