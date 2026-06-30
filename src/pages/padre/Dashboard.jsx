import { useEffect, useState } from "react";
import AppIcon from "../../components/AppIcon";
import { getEstudiantes, getDatosAcademicos, getAnuncios } from "../../api/services";

function PadreDashboard() {
  const [hijo, setHijo] = useState(null);
  const [data, setData] = useState(null);
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    // Demo: el hijo es el estudiante sembrado. Con relacion padre-hijo real se filtra por el padre.
    getEstudiantes().then((es) => {
      const h = es.find((e) => e.idEstudiante === 1) || es[0];
      setHijo(h);
      if (h) getDatosAcademicos(h.idEstudiante).then(setData);
    });
    getAnuncios().then(setAnuncios);
  }, []);

  const stats = [
    { lbl: "Promedio", val: data?.promedio ? data.promedio.toFixed(1) : "—", ic: "chart" },
    { lbl: "Asistencia", val: data ? `${data.asistenciaPct}%` : "—", ic: "check" },
    { lbl: "Pendientes", val: data ? data.pendientesCount : "—", ic: "clipboard" },
    { lbl: "Cursos", val: data ? data.totalCursos : "—", ic: "book" },
  ];

  return (
    <div>
      <header className="page-head">
        <h1>Seguimiento de {hijo ? `${hijo.nombres} ${hijo.apellidos}` : "tu hijo"}</h1>
        <p>Resumen académico de tu hijo(a)</p>
      </header>

      <section className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div>
              <p className="lbl">{s.lbl}</p>
              <h3 className="val">{s.val}</h3>
            </div>
            <span className="ic"><AppIcon name={s.ic} size={18} /></span>
          </div>
        ))}
      </section>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div className="panel-box">
          <h2 style={{ fontSize: 16, marginBottom: 14 }}>Últimas calificaciones</h2>
          {!data || data.calificaciones.length === 0 ? (
            <p className="vacio">Sin calificaciones.</p>
          ) : (
            <table className="data-table">
              <tbody>
                {data.calificaciones.map((g, i) => (
                  <tr key={i}>
                    <td><strong>{g.curso}</strong><br /><small style={{ color: "var(--texto-2)" }}>{g.detalle}</small></td>
                    <td style={{ textAlign: "right", fontWeight: 700, color: "var(--azul)" }}>{Number(g.nota).toFixed(0)}/20</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="panel-box">
          <h2 style={{ fontSize: 16, marginBottom: 14 }}>Anuncios del colegio</h2>
          {anuncios.length === 0 ? (
            <p className="vacio">No hay anuncios.</p>
          ) : (
            anuncios.map((a) => (
              <div key={a.idAnuncio} style={{ padding: "10px 0", borderTop: "1px solid var(--linea)" }}>
                <strong style={{ fontSize: 14 }}>{a.titulo}</strong>
                <p style={{ fontSize: 13, color: "var(--texto-2)", marginTop: 4 }}>{a.contenido}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default PadreDashboard;
