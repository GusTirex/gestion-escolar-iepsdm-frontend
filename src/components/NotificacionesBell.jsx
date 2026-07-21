import { useEffect, useRef, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getNotificaciones, marcarTodasLeidas } from "../api/services";
import AppIcon from "./AppIcon";
import "./NotificacionesBell.css";

// Convierte la fecha del servidor (UTC) en un texto tipo "hace 5 min".
function hace(fechaIso) {
  if (!fechaIso) return "";
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(fechaIso) ? fechaIso : `${fechaIso}Z`;
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "hace un momento";
  if (min < 60) return `hace ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  return `hace ${d} d`;
}

function NotificacionesBell() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [abierto, setAbierto] = useState(false);
  const panelRef = useRef(null);

  const idUsuario = user?.idUsuario;

  const cargar = () => {
    if (!idUsuario) return;
    getNotificaciones().then(setItems);
  };

  // Carga inicial y refresco cada 40 s para ver avisos nuevos.
  useEffect(() => {
    cargar();
    const t = setInterval(cargar, 40000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUsuario]);

  // Cierra el panel al hacer click fuera.
  useEffect(() => {
    const fuera = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("mousedown", fuera);
    return () => document.removeEventListener("mousedown", fuera);
  }, []);

  const noLeidas = items.filter((n) => !n.leida).length;

  const toggle = () => {
    const nuevo = !abierto;
    setAbierto(nuevo);
    // Al abrir, marca todas como leidas (en el server y en la vista).
    if (nuevo && noLeidas > 0) {
      marcarTodasLeidas();
      setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
    }
  };

  if (!idUsuario) return null;

  return (
    <div className="notif" ref={panelRef}>
      <button className="notif-btn" onClick={toggle} aria-label="Notificaciones">
        <AppIcon name="bell" size={20} />
        {noLeidas > 0 && <span className="notif-badge">{noLeidas > 9 ? "9+" : noLeidas}</span>}
      </button>

      {abierto && (
        <div className="notif-panel">
          <div className="notif-head">
            <h4>Notificaciones</h4>
            {items.length > 0 && <span>{items.length}</span>}
          </div>
          <div className="notif-list">
            {items.length === 0 && <p className="notif-vacio">No tienes notificaciones.</p>}
            {items.map((n) => (
              <div className={`notif-item ${n.leida ? "" : "no-leida"}`} key={n.idNotificacion}>
                <span className={`notif-punto ${n.tipo === "NOTA" ? "azul" : "naranja"}`} />
                <div className="notif-cuerpo">
                  <p>{n.mensaje}</p>
                  <small>{hace(n.fecha)}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificacionesBell;
