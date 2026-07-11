import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getDatosAcademicos } from "../../api/services";
import AppIcon from "../../components/AppIcon";
import "./Notas.css";

function color(nota) {
  if (nota >= 17) return "var(--verde)";
  if (nota >= 13) return "var(--azul)";
  return "var(--naranja)";
}

function Notas() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getDatosAcademicos(user.idEntidad)
      .then((d) => (d.online ? setData(d) : setError(true)))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [user.idEntidad]);

  return (
    <div className="notas">
      <header className="page-head">
        <h1>Mis Notas</h1>
        <p>Tu rendimiento académico por curso</p>
      </header>

      {loading && <div className="loader" />}
      {!loading && error && (
        <p className="estado-error">No se pudieron cargar tus notas. Verifica tu conexión.</p>
      )}
      {!loading && data && (
      <>
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
      </>
      )}
    </div>
  );
}

export default Notas;
