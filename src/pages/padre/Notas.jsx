import { useEffect, useState } from "react";
import { getEstudiantes, getDatosAcademicos } from "../../api/services";

function color(nota) {
  if (nota >= 17) return "var(--verde)";
  if (nota >= 13) return "var(--azul)";
  return "var(--naranja)";
}

function PadreNotas() {
  const [hijo, setHijo] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    getEstudiantes().then((es) => {
      const h = es.find((e) => e.idEstudiante === 1) || es[0];
      setHijo(h);
      if (h) getDatosAcademicos(h.idEstudiante).then(setData);
    });
  }, []);

  return (
    <div>
      <header className="page-head">
        <h1>Notas de {hijo ? hijo.nombres : "tu hijo"}</h1>
        <p>Calificaciones por curso</p>
      </header>

      <div className="panel-box" style={{ marginTop: 22 }}>
        {!data || data.notasPorCurso.length === 0 ? (
          <p className="vacio">Aún no hay notas registradas.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Docente</th>
                <th style={{ textAlign: "center" }}>Promedio</th>
              </tr>
            </thead>
            <tbody>
              {data.notasPorCurso.map((c) => (
                <tr key={c.curso}>
                  <td><strong>{c.curso}</strong></td>
                  <td style={{ color: "var(--texto-2)" }}>{c.docente}</td>
                  <td style={{ textAlign: "center", fontWeight: 700, color: color(c.promedio ?? 0) }}>
                    {c.promedio != null ? c.promedio.toFixed(1) : "—"}
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

export default PadreNotas;
