import "./Temas.css";

const semana = {
  numero: 8,
  rango: "27 Mayo - 2 Junio, 2026",
  actual: true,
};

const temas = [
  {
    curso: "Programación Web",
    titulo: "React Hooks Avanzados",
    descripcion: "useContext, useReducer y custom hooks.",
    materiales: [
      { tipo: "video", nombre: "Clase grabada - React Hooks", detalle: "45 min" },
      { tipo: "pdf", nombre: "Guía de Hooks.pdf" },
      { tipo: "link", nombre: "Documentación oficial de React" },
    ],
  },
  {
    curso: "Cálculo I",
    titulo: "Integrales Definidas",
    descripcion: "Teorema fundamental del cálculo y aplicaciones.",
    materiales: [
      { tipo: "video", nombre: "Clase grabada - Integrales", detalle: "50 min" },
      { tipo: "pdf", nombre: "Ejercicios de Integrales.pdf" },
    ],
  },
];

const iconoMaterial = { video: "🎥", pdf: "📄", link: "🔗" };

function Temas() {
  return (
    <div className="temas">
      <header className="page-head">
        <h1>Temas de la Semana</h1>
        <p>Contenido y materiales organizados por semana</p>
      </header>

      <div className="semana-head">
        <h2>
          Semana {semana.numero}{" "}
          <span className="semana-rango">({semana.rango})</span>
        </h2>
        {semana.actual && <span className="badge actual">Semana Actual</span>}
      </div>

      <div className="temas-list">
        {temas.map((t) => (
          <div className="tema-card" key={t.titulo}>
            <div className="tema-head">
              <div className="tema-icon">📘</div>
              <div>
                <span className="tema-curso">{t.curso}</span>
                <h3>{t.titulo}</h3>
                <p>{t.descripcion}</p>
              </div>
            </div>

            <p className="materiales-label">Materiales:</p>
            <div className="materiales">
              {t.materiales.map((m) => (
                <div className="material" key={m.nombre}>
                  <span className="material-icon">{iconoMaterial[m.tipo]}</span>
                  <span className="material-nombre">{m.nombre}</span>
                  {m.detalle && <span className="material-detalle">{m.detalle}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Temas;
