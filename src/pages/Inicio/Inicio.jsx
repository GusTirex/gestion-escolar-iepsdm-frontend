import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDatosAcademicos } from "../../api/services";
import "./Inicio.css";

// Datos de respaldo (si el backend esta apagado, la UI no queda vacia).
const FALLBACK = {
  promedio: 16.8,
  totalCursos: 6,
  pendientesCount: 3,
  asistenciaPct: 92,
  proximosTrabajos: [
    { titulo: "Ensayo de Historia", curso: "Historia Universal", vence: "29 de mayo" },
    { titulo: "Proyecto Final de Programación", curso: "Programación Web", vence: "1 de junio" },
    { titulo: "Tarea de Matemáticas", curso: "Cálculo I", vence: "26 de mayo" },
  ],
  calificaciones: [
    { curso: "Programación Web", detalle: "Tarea 3", nota: 18 },
    { curso: "Cálculo I", detalle: "Examen Parcial", nota: 16 },
    { curso: "Historia Universal", detalle: "Ensayo 2", nota: 17 },
  ],
};

function Inicio() {
  const [data, setData] = useState(FALLBACK);

  useEffect(() => {
    getDatosAcademicos(1).then((d) => {
      if (d.online) setData(d);
    });
  }, []);

  const resumen = [
    { label: "Promedio General", valor: data.promedio ? data.promedio.toFixed(1) : "—", icono: "📈", color: "#2563eb" },
    { label: "Cursos Activos", valor: String(data.totalCursos), icono: "📖", color: "#16a34a" },
    { label: "Trabajos Pendientes", valor: String(data.pendientesCount), icono: "📋", color: "#f59e0b" },
    { label: "Asistencia", valor: `${data.asistenciaPct}%`, icono: "🟣", color: "#8b5cf6" },
  ];

  return (
    <div className="inicio">
      <header className="page-head">
        <h1>Bienvenido de nuevo, Juan</h1>
        <p>Aquí está tu resumen académico</p>
      </header>

      <section className="cards">
        {resumen.map((c) => (
          <div className="card" key={c.label}>
            <div>
              <p className="card-label">{c.label}</p>
              <h3 className="card-valor">{c.valor}</h3>
            </div>
            <span className="card-icono" style={{ background: `${c.color}1a`, color: c.color }}>
              {c.icono}
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
          {data.proximosTrabajos.length === 0 && <p className="vacio">No tienes trabajos pendientes 🎉</p>}
          {data.proximosTrabajos.map((t, i) => (
            <div className="row" key={i}>
              <div className="row-icon naranja">📄</div>
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
              <div className="row-icon azul">📘</div>
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
    </div>
  );
}

export default Inicio;
