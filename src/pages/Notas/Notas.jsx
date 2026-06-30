import { useEffect, useState } from "react";
import { getDatosAcademicos } from "../../api/services";
import AppIcon from "../../components/AppIcon";
import "./Notas.css";

const FALLBACK = {
  promedio: 16.8,
  notasPorCurso: [
    { curso: "Programación Web", docente: "Walter Ramos", promedio: 17.5,
      items: [{ evaluacion: "Tarea 3", nota: 18 }, { evaluacion: "Examen Parcial", nota: 17 }] },
    { curso: "Cálculo I", docente: "María Torres", promedio: 16,
      items: [{ evaluacion: "Examen Parcial", nota: 16 }] },
    { curso: "Historia Universal", docente: "Juan Briam", promedio: 17,
      items: [{ evaluacion: "Ensayo 2", nota: 17 }] },
  ],
};

function color(nota) {
  if (nota >= 17) return "var(--verde)";
  if (nota >= 13) return "var(--azul)";
  return "var(--naranja)";
}

function Notas() {
  const [data, setData] = useState(FALLBACK);

  useEffect(() => {
    getDatosAcademicos(1).then((d) => {
      if (d.online) setData(d);
    });
  }, []);

  return (
    <div className="notas">
      <header className="page-head">
        <h1>Mis Notas</h1>
        <p>Tu rendimiento académico por curso</p>
      </header>

      <div className="promedio-banner">
        <div>
          <p>Promedio General</p>
          <h2>{data.promedio ? data.promedio.toFixed(1) : "—"}</h2>
        </div>
        <span className="promedio-icon"><AppIcon name="chart" size={30} /></span>
      </div>

      <div className="notas-cursos">
        {data.notasPorCurso.map((c) => (
          <div className="curso-card" key={c.curso}>
            <div className="curso-card-head">
              <div>
                <h3>{c.curso}</h3>
                <small>{c.docente}</small>
              </div>
              <span
                className="curso-prom"
                style={{ color: color(c.promedio ?? 0) }}
              >
                {c.promedio != null ? c.promedio.toFixed(1) : "—"}
              </span>
            </div>
            <div className="curso-notas">
              {c.items.map((it, i) => (
                <div className="nota-pill" key={i}>
                  <span>{it.evaluacion}</span>
                  <strong style={{ color: color(it.nota) }}>{Number(it.nota).toFixed(0)}</strong>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notas;
