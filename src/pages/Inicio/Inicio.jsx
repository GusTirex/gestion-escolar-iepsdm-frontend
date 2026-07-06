import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDatosAcademicos } from "../../api/services";
import AppIcon from "../../components/AppIcon";
import "./Inicio.css";

function Inicio() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getDatosAcademicos(1)
      .then((d) => (d.online ? setData(d) : setError(true)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const resumen = data
    ? [
        { label: "Promedio General", valor: data.promedio ? data.promedio.toFixed(1) : "—", icono: "chart", color: "#2563eb" },
        { label: "Cursos Activos", valor: String(data.totalCursos), icono: "book", color: "#16a34a" },
        { label: "Trabajos Pendientes", valor: String(data.pendientesCount), icono: "clipboard", color: "#f59e0b" },
        { label: "Asistencia", valor: `${data.asistenciaPct}%`, icono: "check", color: "#8b5cf6" },
      ]
    : [];

  return (
    <div className="inicio">
      <header className="page-head">
        <h1>Bienvenido de nuevo, Juan</h1>
        <p>Aquí está tu resumen académico</p>
      </header>

      {loading && <div className="loader" />}
      {!loading && error && (
        <p className="estado-error">No se pudieron cargar tus datos. Verifica tu conexión e intenta de nuevo.</p>
      )}
      {!loading && data && (
      <>
      <section className="cards">
        {resumen.map((c) => (
          <div className="card" key={c.label}>
            <div>
              <p className="card-label">{c.label}</p>
              <h3 className="card-valor">{c.valor}</h3>
            </div>
            <span className="card-icono" style={{ background: `${c.color}1a`, color: c.color }}>
              <AppIcon name={c.icono} size={18} />
            </span>
          </div>
        ))}
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="panel-head">
            <h2>Próximos Trabajos</h2>
            <Link className="link-btn" to="/estudiante/trabajos">Ver todos</Link>
          </div>
          {data.proximosTrabajos.length === 0 && <p className="vacio">No tienes trabajos pendientes.</p>}
          {data.proximosTrabajos.map((t, i) => (
            <div className="row" key={i}>
              <div className="row-icon naranja"><AppIcon name="file" size={18} /></div>
              <div className="row-main">
                <h4>{t.titulo}</h4>
                <p>{t.curso}</p>
                <small>Vence: {t.vence}</small>
              </div>
              <span className="badge pendiente">Pendiente</span>
            </div>
          ))}
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Calificaciones Recientes</h2>
            <Link className="link-btn" to="/estudiante/notas">Ver todas</Link>
          </div>
          {data.calificaciones.length === 0 && <p className="vacio">Aún no hay calificaciones.</p>}
          {data.calificaciones.map((g, i) => (
            <div className="row" key={i}>
              <div className="row-icon azul"><AppIcon name="book" size={18} /></div>
              <div className="row-main">
                <h4>{g.curso}</h4>
                <p>{g.detalle}</p>
              </div>
              <strong className="nota">
                {Number(g.nota).toFixed(0)} <small>/20</small>
              </strong>
            </div>
          ))}
        </div>
      </section>
      </>
      )}
    </div>
  );
}

export default Inicio;
