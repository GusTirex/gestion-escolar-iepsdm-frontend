import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { getCursosDeDocente, getEstudiantes, getEvaluaciones } from "../../api/services";

function DocenteDashboard() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);
  const [estudiantes, setEstudiantes] = useState(0);
  const [evaluaciones, setEvaluaciones] = useState(0);

  useEffect(() => {
    getCursosDeDocente(user.idEntidad).then(setCursos);
    getEstudiantes().then((e) => setEstudiantes(e.length));
    getEvaluaciones().then((ev) => setEvaluaciones(ev.length));
  }, [user.idEntidad]);

  const stats = [
    { lbl: "Mis Cursos", val: cursos.length, ic: "📚" },
    { lbl: "Estudiantes", val: estudiantes, ic: "🎓" },
    { lbl: "Evaluaciones", val: evaluaciones, ic: "📝" },
    { lbl: "Secciones", val: new Set(cursos.map((c) => c.idSeccion)).size, ic: "🏫" },
  ];

  return (
    <div>
      <header className="page-head">
        <h1>Hola, {user.nombre}</h1>
        <p>Panel del docente</p>
      </header>

      <section className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.lbl}>
            <div>
              <p className="lbl">{s.lbl}</p>
              <h3 className="val">{s.val}</h3>
            </div>
            <span className="ic">{s.ic}</span>
          </div>
        ))}
      </section>

      <div className="panel-box">
        <div className="panel-head" style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16 }}>Mis Cursos</h2>
          <Link className="link-btn" to="/docente/notas">Registrar notas</Link>
        </div>
        {cursos.length === 0 && <p className="vacio">No tienes cursos asignados.</p>}
        <table className="data-table">
          <tbody>
            {cursos.map((c) => (
              <tr key={c.idCurso}>
                <td><strong>{c.nombre}</strong></td>
                <td>{c.descripcion}</td>
                <td style={{ textAlign: "right" }}>Sección {c.idSeccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DocenteDashboard;
