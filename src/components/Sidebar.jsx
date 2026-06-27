import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const items = [
  { to: "/", label: "Inicio", icon: "🏠", end: true },
  { to: "/notas", label: "Notas", icon: "📘" },
  { to: "/trabajos", label: "Trabajos", icon: "📄" },
  { to: "/temas", label: "Temas Semanales", icon: "📅" },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>Campus Virtual</h2>
        <p>Portal del Estudiante</p>
      </div>

      <nav className="menu">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
          >
            <span className="menu-icon">{it.icon}</span>
            {it.label}
          </NavLink>
        ))}
      </nav>

      <div className="user-box">
        <div className="avatar">JP</div>
        <div className="user-info">
          <strong>Juan Pérez</strong>
          <span>Estudiante</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
