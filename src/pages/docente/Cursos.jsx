import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getCursosDeDocente } from "../../api/services";

function DocenteCursos() {
  const { user } = useAuth();
  const [cursos, setCursos] = useState([]);

  useEffect(() => {
    getCursosDeDocente(user.idEntidad).then(setCursos);
  }, [user.idEntidad]);

  return (
    <div>
      <header className="page-head">
        <h1>Mis Cursos</h1>
        <p>Cursos que tienes asignados este periodo</p>
      </header>

      <div className="panel-box" style={{ marginTop: 22 }}>
        {cursos.length === 0 && <p className="vacio">No tienes cursos asignados.</p>}
        {cursos.length > 0 && (
          <table className="data-table">
            <thead>
              <tr>
                <th>Curso</th>
                <th>Descripción</th>
                <th>Sección</th>
              </tr>
            </thead>
            <tbody>
              {cursos.map((c) => (
                <tr key={c.idCurso}>
                  <td><strong>{c.nombre}</strong></td>
                  <td>{c.descripcion}</td>
                  <td>Sección {c.idSeccion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default DocenteCursos;
