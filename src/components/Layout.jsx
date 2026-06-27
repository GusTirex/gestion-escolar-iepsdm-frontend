import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import ChatWidget from "./ChatWidget";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-content">
        <Outlet />
      </main>
      <ChatWidget />
    </div>
  );
}

export default Layout;
