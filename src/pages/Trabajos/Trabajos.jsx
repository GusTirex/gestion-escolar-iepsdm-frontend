import { useEffect, useState } from "react";
import { getDatosAcademicos } from "../../api/services";
import "./Trabajos.css";

const FALLBACK = {
  trabajosPendientes: [
    { titulo: "Ensayo sobre la Revolución Industrial", curso: "Historia Universal", vence: "29 de mayo de 2026", restantes: "3 días restantes" },
    { titulo: "Proyecto Final - Aplicación Web", curso: "Programación Web", vence: "1 de junio de 2026", restantes: "6 días restantes" },
    { titulo: "Tarea de Derivadas", curso: "Cálculo I", vence: "28 de mayo de 2026", restantes: "2 días restantes" },
  ],
  trabajosCompletados: [
    { titulo: "Tarea 3", curso: "Programación Web", vence: "10 de mayo de 2026", nota: 18 },
  ],
};

function Trabajos() {
  const [data, setData] = useState(FALLBACK);
  const [tab, setTab] = useState("pendientes");

  useEffect(() => {
    getDatosAcademicos(1).then((d) => {
      if (d.online) setData(d);
    });
  }, []);

  const esPend = tab === "pendientes";
  const lista = esPend ? data.trabajosPendientes : data.trabajosCompletados;

  return (
    <div className="trabajos">
      <header className="page-head">
        <h1>Mis Trabajos</h1>
        <p>Gestiona tus tareas y entregas</p>
      </header>

      <div className="tabs">
        <button className={esPend ? "tab active" : "tab"} onClick={() => setTab("pendientes")}>
          Pendientes ({data.trabajosPendientes.length})
        </button>
        <button className={!esPend ? "tab active" : "tab"} onClick={() => setTab("completadas")}>
          Completadas ({data.trabajosCompletados.length})
        </button>
      </div>

      <div className="trabajos-list">
        {lista.length === 0 && (
          <p className="vacio">
            {esPend ? "No tienes trabajos pendientes 🎉" : "Aún no hay trabajos completados."}
          </p>
        )}
        {lista.map((t, i) => (
          <div className="trabajo-card" key={i}>
            <div className="trabajo-icon">📄</div>
            <div className="trabajo-main">
              <div className="trabajo-top">
                <h3>{t.titulo}</h3>
                <span className={`badge ${esPend ? "pendiente" : "completado"}`}>
                  {esPend ? "Pendiente" : "Completado"}
                </span>
              </div>
              <p className="trabajo-curso">{t.curso}</p>
              <div className="trabajo-meta">
                <span>📅 Vence: {t.vence}</span>
                {esPend ? (
                  <span className="restantes">⏱ {t.restantes}</span>
                ) : (
                  <span className="nota-inline">Nota: {Number(t.nota).toFixed(0)}/20</span>
                )}
              </div>
              {esPend && <button className="btn-entregar">Entregar Trabajo</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Trabajos;
