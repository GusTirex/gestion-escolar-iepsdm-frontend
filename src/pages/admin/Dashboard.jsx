import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppIcon from "../../components/AppIcon";
import {
  getEstudiantes, getDocentes, getCursos, getUsuarios, getPadres, getAnuncios,
} from "../../api/services";

function AdminDashboard() {
  const [c, setC] = useState({ est: 0, doc: 0, cur: 0, usr: 0, pad: 0 });
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    Promise.all([getEstudiantes(), getDocentes(), getCursos(), getUsuarios(), getPadres()]).then(
      ([est, doc, cur, usr, pad]) =>
        setC({ est: est.length, doc: doc.length, cur: cur.length, usr: usr.length, pad: pad.length })
    );
    getAnuncios().then(setAnuncios);
  }, []);

  const stats = [
    { lbl: "Estudiantes", val: c.est, ic: "graduation" },
    { lbl: "Docentes", val: c.doc, ic: "users" },
    { lbl: "Cursos", val: c.cur, ic: "book" },
    { lbl: "Padres", val: c.pad, ic: "users" },
  ];

  return (
    <div>
      <header className="page-head">
        <h1>Panel de Administración</h1>
        <p>Resumen general del colegio</p>
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

      <div className="panel-box">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16 }}>Anuncios publicados</h2>
          <Link className="link-btn" to="/admin/gestion">Ir a Gestión</Link>
        </div>
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
  );
}

export default AdminDashboard;
