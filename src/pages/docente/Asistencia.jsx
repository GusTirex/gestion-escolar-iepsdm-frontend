import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getCursosDeDocente, getEstudiantesDeSeccion, crearAsistencia } from "../../api/services";

function hoyISO() {
  return new Date().toISOString().slice(0, 10);
}

function DocenteAsistencia() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [cursoId, setCursoId] = useState("");
  const [fecha, setFecha] = useState(hoyISO());
  const [estudiantes, setEstudiantes] = useState([]);
  const [presentes, setPresentes] = useState({});
  const [guardando, setGuardando] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getCursosDeDocente(user.idEntidad).then(setCursos);
  }, [user.idEntidad]);

  useEffect(() => {
    if (!cursoId) return;
    const curso = cursos.find((c) => String(c.idCurso) === String(cursoId));
    if (curso)
      getEstudiantesDeSeccion(curso.idSeccion).then((ests) => {
        setEstudiantes(ests);
        const init = {};
        ests.forEach((e) => (init[e.idEstudiante] = true)); // por defecto presentes
        setPresentes(init);
      });
  }, [cursoId, cursos]);

  const guardar = async () => {
    if (!cursoId || estudiantes.length === 0) return;
    setGuardando(true);
    let ok = 0;
    for (const est of estudiantes) {
      try {
        await crearAsistencia({
          fecha,
          estado: !!presentes[est.idEstudiante],
          idEstudiante: est.idEstudiante,
        });
        ok++;
      } catch {
        /* ignora errores individuales */
      }
    }
    setGuardando(false);
    setToast(`✓ Asistencia registrada para ${ok} estudiante(s)`);
    setTimeout(() => setToast(""), 3000);
  };

  return (
    <div>
      <header className="page-head">
        <h1>Asistencia</h1>
        <p>Marca la asistencia del día por curso</p>
      </header>

      <div className="toolbar">
        <label className="field">
          Curso
          <select value={cursoId} onChange={(e) => setCursoId(e.target.value)}>
            <option value="">— Selecciona —</option>
            {cursos.map((c) => (
              <option key={c.idCurso} value={c.idCurso}>{c.nombre}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Fecha
          <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </label>
      </div>

      {cursoId && (
        <div className="panel-box">
          {estudiantes.length === 0 ? (
            <p className="vacio">No hay estudiantes matriculados en este curso.</p>
          ) : (
            <>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th style={{ width: 140, textAlign: "center" }}>Presente</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantes.map((est) => (
                    <tr key={est.idEstudiante}>
                      <td>{est.nombres} {est.apellidos}</td>
                      <td style={{ textAlign: "center" }}>
                        <input
                          type="checkbox"
                          checked={!!presentes[est.idEstudiante]}
                          onChange={(e) =>
                            setPresentes((p) => ({ ...p, [est.idEstudiante]: e.target.checked }))
                          }
                          style={{ width: 18, height: 18 }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn-primary" style={{ marginTop: 16 }} onClick={guardar} disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar asistencia"}
              </button>
            </>
          )}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default DocenteAsistencia;
