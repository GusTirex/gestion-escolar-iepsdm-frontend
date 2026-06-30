import { useEffect, useState } from "react";
import { getEstudiantes, getAsistencias } from "../../api/services";
import AppIcon from "../../components/AppIcon";

function PadreAsistencia() {
  const [hijo, setHijo] = useState(null);
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    getEstudiantes().then((es) => {
      const h = es.find((e) => e.idEstudiante === 1) || es[0];
      setHijo(h);
      if (h)
        getAsistencias().then((a) =>
          setAsistencias(
            a
              .filter((x) => x.idEstudiante === h.idEstudiante)
              .sort((p, q) => (q.fecha || "").localeCompare(p.fecha || ""))
          )
        );
    });
  }, []);

  const total = asistencias.length;
  const presentes = asistencias.filter((a) => a.estado).length;
  const pct = total ? Math.round((presentes / total) * 100) : 0;

  return (
    <div>
      <header className="page-head">
        <h1>Asistencia de {hijo ? hijo.nombres : "tu hijo"}</h1>
        <p>Registro de asistencia</p>
      </header>

      <section className="stat-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat-card"><div><p className="lbl">Asistencia</p><h3 className="val">{pct}%</h3></div><span className="ic"><AppIcon name="check" size={18} /></span></div>
        <div className="stat-card"><div><p className="lbl">Días presentes</p><h3 className="val">{presentes}</h3></div><span className="ic"><AppIcon name="chart" size={18} /></span></div>
        <div className="stat-card"><div><p className="lbl">Faltas</p><h3 className="val">{total - presentes}</h3></div><span className="ic"><AppIcon name="x-circle" size={18} /></span></div>
      </section>

      <div className="panel-box">
        {total === 0 ? (
          <p className="vacio">Sin registros de asistencia.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Fecha</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {asistencias.map((a) => (
                <tr key={a.idAsistencia}>
                  <td>{a.fecha}</td>
                  <td>
                    <span className={`badge ${a.estado ? "completado" : "pendiente"}`}>
                      {a.estado ? "Presente" : "Ausente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default PadreAsistencia;
