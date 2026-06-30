import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import AppIcon from "./AppIcon";
import "./Sidebar.css";

const MENUS = {
  ESTUDIANTE: {
    subtitulo: "Portal del Estudiante",
    rolLabel: "Estudiante",
    items: [
      { to: "/estudiante", label: "Inicio", icon: "home", end: true },
      { to: "/estudiante/notas", label: "Notas", icon: "book" },
      { to: "/estudiante/trabajos", label: "Trabajos", icon: "file" },
      { to: "/estudiante/temas", label: "Temas Semanales", icon: "calendar" },
    ],
  },
  DOCENTE: {
    subtitulo: "Portal del Docente",
    rolLabel: "Docente",
    items: [
      { to: "/docente", label: "Inicio", icon: "home", end: true },
      { to: "/docente/cursos", label: "Mis Cursos", icon: "book" },
      { to: "/docente/notas", label: "Registrar Notas", icon: "clipboard" },
      { to: "/docente/asistencia", label: "Asistencia", icon: "check" },
    ],
  },
  PADRE: {
    subtitulo: "Portal del Padre",
    rolLabel: "Padre de familia",
    items: [
      { to: "/padre", label: "Inicio", icon: "home", end: true },
      { to: "/padre/notas", label: "Notas de mi hijo", icon: "book" },
      { to: "/padre/asistencia", label: "Asistencia", icon: "check" },
    ],
  },
  ADMIN: {
    subtitulo: "Administración",
    rolLabel: "Administrador",
    items: [
      { to: "/admin", label: "Inicio", icon: "home", end: true },
      { to: "/admin/gestion", label: "Gestión", icon: "settings" },
    ],
  },
};

function iniciales(nombre) {
  return (nombre || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Sidebar() {
  const { user, cerrarSesion } = useAuth();
  const rol = user?.rol || "ESTUDIANTE";
  const menu = MENUS[rol] || MENUS.ESTUDIANTE;

  return (
    <aside className="sidebar">
      <div className="brand">
        <h2>Campus Virtual</h2>
        <p>{menu.subtitulo}</p>
      </div>

      <nav className="menu">
        {menu.items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            end={it.end}
            className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}
          >
              <span className="menu-icon"><AppIcon name={it.icon} size={17} /></span>
            {it.label}
          </NavLink>
        ))}
      </nav>

      <div className="user-box">
        <div className="avatar">{iniciales(user?.nombre)}</div>
        <div className="user-info">
          <strong>{user?.nombre || "Invitado"}</strong>
          <span>{menu.rolLabel}</span>
        </div>
      </div>
      <button className="logout-btn" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;
