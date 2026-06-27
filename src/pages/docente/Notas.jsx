import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  getCursosDeDocente,
  getEvaluaciones,
  getEstudiantesDeSeccion,
  getNotas,
  crearNota,
} from "../../api/services";

function DocenteNotas() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState("");
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [evalId, setEvalId] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [valores, setValores] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getCursosDeDocente(user.idEntidad).then(setCursos);
  }, [user.idEntidad]);

  // Al elegir curso: carga sus evaluaciones y los estudiantes de su seccion
  useEffect(() => {
    if (!cursoId) return;
    const curso = cursos.find((c) => String(c.idCurso) === String(cursoId));
    getEvaluaciones().then((evs) =>
      setEvaluaciones(evs.filter((e) => String(e.idCurso) === String(cursoId)))
    );
    if (curso) getEstudiantesDeSeccion(curso.idSeccion).then(setEstudiantes);
  }, [cursoId, cursos]);

  // Al elegir evaluacion: precarga las notas existentes
  useEffect(() => {
    if (!evalId) return;
    getNotas().then((notas) => {
      const map = {};
      notas
        .filter((n) => String(n.idEvaluacion) === String(evalId))
        .forEach((n) => {
          map[n.idEstudiante] = String(n.nota);
        });
      setValores(map);
    });
  }, [evalId]);

  // Los reseteos se hacen en los manejadores (no en efectos) para evitar renders en cascada.
  const onCursoChange = (e) => {
    setCursoId(e.target.value);
    setEvalId("");
    setValores({});
    setEvaluaciones([]);
    setEstudiantes([]);
  };

  const onEvalChange = (e) => {
    const v = e.target.value;
    setEvalId(v);
    if (!v) setValores({});
  };

  const guardar = async () => {
    if (!evalId) return;
    setGuardando(true);
    let ok = 0;
    for (const est of estudiantes) {
      const v = valores[est.idEstudiante];
      if (v === undefined || v === "") continue;
      try {
        await crearNota({
          nota: Number(v),
          observacion: "",
          idEvaluacion: Number(evalId),
          idEstudiante: est.idEstudiante,
        });
        ok++;
      } catch {
        /* ignora errores individuales */
      }
    }
    setGuardando(false);
    setToast(`✓ ${ok} nota(s) guardada(s)`);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div>
      <header className="page-head">
        <h1>Registrar Notas</h1>
        <p>Selecciona el curso y la evaluación para calificar</p>
      </header>

      <div className="toolbar">
        <label className="field">
          Curso
          <select value={cursoId} onChange={onCursoChange}>
            <option value="">— Selecciona —</option>
            {cursos.map((c) => (
              <option key={c.idCurso} value={c.idCurso}>{c.nombre}</option>
            ))}
          </select>
        </label>

        <label className="field">
          Evaluación
          <select value={evalId} onChange={onEvalChange} disabled={!cursoId}>
            <option value="">— Selecciona —</option>
            {evaluaciones.map((ev) => (
              <option key={ev.idEvaluacion} value={ev.idEvaluacion}>{ev.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      {evalId && (
        <div className="panel-box">
          {estudiantes.length === 0 ? (
            <p className="vacio">No hay estudiantes matriculados en este curso.</p>
          ) : (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th style={{ width: 120, textAlign: "center" }}>Nota (0-20)</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((est) => (
                    <tr key={est.idEstudiante}>
                      <td>{est.nombres} {est.apellidos}</td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          className="nota-input"
                          type="number"
                          min="0"
                          max="20"
                          step="0.5"
                          value={valores[est.idEstudiante] ?? ""}
                          onChange={(e) =>
                            setValores((p) => ({ ...p, [est.idEstudiante]: e.target.value }))
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={guardar} disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar notas"}
              </button>
            </>
          )}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default DocenteNotas;
