import { useEffect, useState } from "react";
import { getEstudiantes, getDocentes, getCursos, getAnuncios } from "../../api/services";

const TABS = [
  { key: "estudiantes", label: "Estudiantes" },
  { key: "docentes", label: "Docentes" },
  { key: "cursos", label: "Cursos" },
  { key: "anuncios", label: "Anuncios" },
];

function Gestion() {
  const [tab, setTab] = useState("estudiantes");
  const [data, setData] = useState({ estudiantes: [], docentes: [], cursos: [], anuncios: [] });

  useEffect(() => {
    Promise.all([getEstudiantes(), getDocentes(), getCursos(), getAnuncios()]).then(
      ([estudiantes, docentes, cursos, anuncios]) =>
        setData({ estudiantes, docentes, cursos, anuncios })
    );
  }, []);

  return (
    <div>
      <header className="page-head">
        <h1>Gestión</h1>
        <p>Administra las entidades del sistema</p>
      </header>

      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.key} className={tab === t.key ? "tab active" : "tab"} onClick={() => setTab(t.key)}>
            {t.label} ({data[t.key].length})
          </button>
        ))}
      </div>

      <div className="panel-box">
        {tab === "estudiantes" && (
          <Tabla
            cols={["Nombres", "Apellidos", "Teléfono"]}
            rows={data.estudiantes.map((e) => [e.nombres, e.apellidos, e.telefono || "—"])}
            vacio="No hay estudiantes."
          />
        )}
        {tab === "docentes" && (
          <Tabla
            cols={["Nombres", "Apellidos", "Especialidad"]}
            rows={data.docentes.map((d) => [d.nombres, d.apellidos, d.especialidad || "—"])}
            vacio="No hay docentes."
          />
        )}
        {tab === "cursos" && (
          <Tabla
            cols={["Curso", "Descripción"]}
            rows={data.cursos.map((c) => [c.nombre, c.descripcion || "—"])}
            vacio="No hay cursos."
          />
        )}
        {tab === "anuncios" && (
          <Tabla
            cols={["Título", "Contenido", "Fecha"]}
            rows={data.anuncios.map((a) => [a.titulo, a.contenido, a.fecha])}
            vacio="No hay anuncios."
          />
        )}
      </div>
    </div>
  );
}

function Tabla({ cols, rows, vacio }) {
  if (rows.length === 0) return <p className="vacio">{vacio}</p>;
  return (
    <table className="data-table">
      <thead>
        <tr>{cols.map((c) => <th key={c}>{c}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
        ))}
      </tbody>
    </table>
  );
}

export default Gestion;
