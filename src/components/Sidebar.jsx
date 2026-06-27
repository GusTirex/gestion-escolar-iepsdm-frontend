import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./Sidebar.css";

const MENUS = {
  ESTUDIANTE: {
    subtitulo: "Portal del Estudiante",
    rolLabel: "Estudiante",
    items: [
      { to: "/estudiante", label: "Inicio", icon: "🏠", end: true },
      { to: "/estudiante/notas", label: "Notas", icon: "📘" },
      { to: "/estudiante/trabajos", label: "Trabajos", icon: "📄" },
      { to: "/estudiante/temas", label: "Temas Semanales", icon: "📅" },
    ],
  },
  DOCENTE: {
    subtitulo: "Portal del Docente",
    rolLabel: "Docente",
    items: [
      { to: "/docente", label: "Inicio", icon: "🏠", end: true },
      { to: "/docente/cursos", label: "Mis Cursos", icon: "📚" },
      { to: "/docente/notas", label: "Registrar Notas", icon: "📝" },
      { to: "/docente/asistencia", label: "Asistencia", icon: "✅" },
    ],
  },
  PADRE: {
    subtitulo: "Portal del Padre",
    rolLabel: "Padre de familia",
    items: [
      { to: "/padre", label: "Inicio", icon: "🏠", end: true },
      { to: "/padre/notas", label: "Notas de mi hijo", icon: "📘" },
      { to: "/padre/asistencia", label: "Asistencia", icon: "✅" },
    ],
  },
  ADMIN: {
    subtitulo: "Administración",
    rolLabel: "Administrador",
    items: [
      { to: "/admin", label: "Inicio", icon: "🏠", end: true },
      { to: "/admin/gestion", label: "Gestión", icon: "🗂️" },
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
            <span className="menu-icon">{it.icon}</span>
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
