import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getDatosAcademicos, getEntregasEstudiante, crearEntrega } from "../../api/services";
import AppIcon from "../../components/AppIcon";
import "./Trabajos.css";

function Trabajos() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [entregas, setEntregas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState("pendientes");
  const [enviando, setEnviando] = useState(null); // idEvaluacion que se esta entregando
  const [toast, setToast] = useState("");
  const toastTimer = useRef(null);

  // Trae el resumen academico y las entregas ya registradas en la BD.
  const cargar = () =>
    Promise.all([getDatosAcademicos(user.idEntidad), getEntregasEstudiante(user.idEntidad)])
      .then(([d, ents]) => {
        if (d.online) {
          setData(d);
          setEntregas(ents);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));

  useEffect(() => {
    cargar().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.idEntidad]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const entregadasIds = new Set(entregas.map((e) => e.idEvaluacion));
  const calificadosIds = new Set((data?.trabajosCompletados || []).map((t) => t.idEvaluacion));

  const pendientes = (data?.trabajosPendientes || []).filter((t) => !entregadasIds.has(t.idEvaluacion));
  const enRevision = entregas
    .filter((e) => !calificadosIds.has(e.idEvaluacion))
    .map((e) => ({ ...e, enRevision: true }));
  const completadas = [...enRevision, ...(data?.trabajosCompletados || [])];

  const entregar = async (t) => {
    if (entregadasIds.has(t.idEvaluacion) || enviando) return;
    setEnviando(t.idEvaluacion);
    try {
      await crearEntrega(user.idEntidad, t.idEvaluacion);
      await cargar();
      mostrarToast(`✓ "${t.titulo}" entregado correctamente`);
    } catch {
      mostrarToast("No se pudo entregar. Intenta de nuevo.");
    } finally {
      setEnviando(null);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  };

  const esPend = tab === "pendientes";
  const lista = esPend ? pendientes : completadas;

  return (
    <div className="trabajos">
      <header className="page-head">
        <h1>Mis Trabajos</h1>
        <p>Gestiona tus tareas y entregas</p>
      </header>

      {loading && <div className="loader" />}
      {!loading && error && (
        <p className="estado-error">No se pudieron cargar tus trabajos. Verifica tu conexión.</p>
      )}
      {!loading && data && (
      <>
      <div className="tabs">
        <button className={esPend ? "tab active" : "tab"} onClick={() => setTab("pendientes")}>
          Pendientes ({pendientes.length})
        </button>
        <button className={!esPend ? "tab active" : "tab"} onClick={() => setTab("completadas")}>
          Completadas ({completadas.length})
        </button>
      </div>

      <div className="trabajos-list">
        {lista.length === 0 && (
          <p className="vacio">
            {esPend ? "No tienes trabajos pendientes 🎉" : "Aún no hay trabajos completados."}
          </p>
        )}
        {lista.map((t, i) => (
          <div className="trabajo-card" key={(t.idEvaluacion ?? "x") + "-" + i}>
            <div className="trabajo-icon"><AppIcon name="file" size={22} /></div>
            <div className="trabajo-main">
              <div className="trabajo-top">
                <h3>{t.titulo}</h3>
                {esPend ? (
                  <span className="badge pendiente">Pendiente</span>
                ) : t.enRevision ? (
                  <span className="badge revision">En revisión</span>
                ) : (
                  <span className="badge completado">Completado</span>
                )}
              </div>
              <p className="trabajo-curso">{t.curso}</p>
              <div className="trabajo-meta">
                <span><AppIcon name="calendar" size={14} /> Vence: {t.vence}</span>
                {esPend ? (
                  <span className="restantes"><AppIcon name="clock" size={14} /> {t.restantes}</span>
                ) : t.enRevision ? (
                  <span className="revision-txt">Entregado · pendiente de calificación</span>
                ) : (
                  <span className="nota-inline">Nota: {Number(t.nota).toFixed(0)}/20</span>
                )}
              </div>
              {esPend && (
                <button
                  className="btn-entregar"
                  disabled={enviando === t.idEvaluacion}
                  onClick={() => entregar(t)}
                >
                  {enviando === t.idEvaluacion ? "Entregando..." : "Entregar Trabajo"}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      </>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default Trabajos;
