import api from "./client";

// ---- Chatbot IA (Gemini en el backend) ----
export async function enviarMensajeChat(payload) {
  const { data } = await api.post("/chat", payload);
  return data; // { respuesta: "..." }
}

// ---- Recursos academicos (CRUD del backend) ----
// Devuelven [] si el backend no responde, para que la UI no se rompa.
async function safeGet(path) {
  try {
    const { data } = await api.get(path);
    return Array.isArray(data) ? data : data?.content ?? [];
  } catch {
    return [];
  }
}

export const getCursos = () => safeGet("/cursos");
export const getEstudiantes = () => safeGet("/estudiantes");
export const getDocentes = () => safeGet("/docentes");
export const getDocentesCursos = () => safeGet("/docentes-cursos");
// Si se pasa idEstudiante, el backend filtra en el servidor (no baja toda la tabla).
export const getNotas = (idEstudiante) =>
  safeGet(idEstudiante != null ? `/notas?idEstudiante=${idEstudiante}` : "/notas");
export const getEvaluaciones = () => safeGet("/evaluaciones");
export const getAsistencias = (idEstudiante) =>
  safeGet(idEstudiante != null ? `/asistencias?idEstudiante=${idEstudiante}` : "/asistencias");
export const getAnuncios = () => safeGet("/anuncios");
export const getUsuarios = () => safeGet("/usuarios");
export const getRoles = () => safeGet("/roles");
export const getPadres = () => safeGet("/padres");
// Hijos vinculados a un padre (relación real estudiantes_padres)
export const getHijosDePadre = (idPadre) => safeGet(`/padres/${idPadre}/hijos`);
export const getMatriculas = () => safeGet("/matriculas");
export const getSecciones = () => safeGet("/secciones");

// ---- Escrituras (el portal docente registra notas y asistencia) ----
export async function crearNota(payload) {
  const { data } = await api.post("/notas", payload);
  return data;
}
export async function crearAsistencia(payload) {
  const { data } = await api.post("/asistencias", payload);
  return data;
}

// ---- Autenticacion (endpoint real del backend: POST /auth/login) ----
// Devuelve el usuario { idUsuario, usuario, email, rol, nombre, idEntidad }
// o null si las credenciales son invalidas. Lanza si hay error de red/servidor.
export async function login(usuario, password) {
  try {
    const { data } = await api.post("/auth/login", { usuario, password });
    return data;
  } catch (e) {
    if (e.response && e.response.status >= 400 && e.response.status < 500) {
      return null; // credenciales invalidas o datos incompletos
    }
    throw e; // error de red o del servidor
  }
}

// ---- Cursos que dicta un docente ----
export async function getCursosDeDocente(idDocente) {
  const [cursos, docCursos] = await Promise.all([getCursos(), getDocentesCursos()]);
  const cursoById = Object.fromEntries(cursos.map((c) => [c.idCurso, c]));
  return docCursos
    .filter((dc) => dc.idDocente === idDocente)
    .map((dc) => ({ ...cursoById[dc.idCurso], idSeccion: dc.idSeccion, idDocenteCurso: dc.idDocenteCurso }))
    .filter((c) => c.idCurso);
}

// ---- Estudiantes matriculados en una seccion ----
export async function getEstudiantesDeSeccion(idSeccion) {
  const [estudiantes, matriculas] = await Promise.all([getEstudiantes(), getMatriculas()]);
  const idsSeccion = new Set(
    matriculas.filter((m) => m.idSeccion === idSeccion).map((m) => m.idEstudiante)
  );
  return estudiantes.filter((e) => idsSeccion.has(e.idEstudiante));
}

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function fmtFecha(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES[m - 1]} de ${y}`;
}

function diasRestantes(iso) {
  if (!iso) return null;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [y, m, d] = iso.split("-").map(Number);
  const f = new Date(y, m - 1, d);
  return Math.round((f - hoy) / 86400000);
}

// Trae TODO el resumen academico de un estudiante, ya cruzado entre tablas.
// Esta es la pieza que "enlaza todo": notas + evaluaciones + cursos + docentes + asistencias.
export async function getDatosAcademicos(idEstudiante = 1) {
  const [cursos, notas, evaluaciones, asistencias, docentes, docCursos] = await Promise.all([
    getCursos(), getNotas(idEstudiante), getEvaluaciones(), getAsistencias(idEstudiante), getDocentes(), getDocentesCursos(),
  ]);

  const cursoById = Object.fromEntries(cursos.map((c) => [c.idCurso, c]));
  const evalById = Object.fromEntries(evaluaciones.map((e) => [e.idEvaluacion, e]));
  const docById = Object.fromEntries(docentes.map((d) => [d.idDocente, d]));
  const docenteDeCurso = {};
  docCursos.forEach((dc) => {
    if (!docenteDeCurso[dc.idCurso]) docenteDeCurso[dc.idCurso] = docById[dc.idDocente];
  });

  const misNotas = notas.filter((n) => n.idEstudiante === idEstudiante);
  const notasFull = misNotas.map((n) => {
    const ev = evalById[n.idEvaluacion] || {};
    const curso = cursoById[ev.idCurso] || {};
    return {
      idNota: n.idNota, nota: n.nota, evaluacion: ev.nombre, fecha: ev.fecha,
      idCurso: ev.idCurso, curso: curso.nombre || "Curso",
    };
  });

  const promedio = notasFull.length
    ? notasFull.reduce((s, n) => s + n.nota, 0) / notasFull.length
    : 0;

  const misAsist = asistencias.filter((a) => a.idEstudiante === idEstudiante);
  const presentes = misAsist.filter((a) => a.estado).length;
  const asistenciaPct = misAsist.length ? Math.round((presentes / misAsist.length) * 100) : 0;

  // Pendientes = evaluaciones sin nota del estudiante
  const idsConNota = new Set(misNotas.map((n) => n.idEvaluacion));
  const trabajosPendientes = evaluaciones
    .filter((e) => !idsConNota.has(e.idEvaluacion))
    .sort((a, b) => (a.fecha || "").localeCompare(b.fecha || ""))
    .map((e) => {
      const dias = diasRestantes(e.fecha);
      return {
        titulo: e.nombre,
        curso: (cursoById[e.idCurso] || {}).nombre || "Curso",
        vence: fmtFecha(e.fecha),
        restantes: dias != null ? (dias >= 0 ? `${dias} días restantes` : "Vencido") : "",
      };
    });

  const trabajosCompletados = notasFull
    .slice()
    .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""))
    .map((n) => ({ titulo: n.evaluacion, curso: n.curso, vence: fmtFecha(n.fecha), nota: n.nota }));

  const calificaciones = notasFull
    .slice()
    .sort((a, b) => (b.fecha || "").localeCompare(a.fecha || ""))
    .slice(0, 4)
    .map((n) => ({ curso: n.curso, detalle: n.evaluacion, nota: n.nota }));

  const notasPorCurso = cursos
    .map((c) => {
      const items = notasFull.filter((n) => n.idCurso === c.idCurso);
      const prom = items.length ? items.reduce((s, n) => s + n.nota, 0) / items.length : null;
      const doc = docenteDeCurso[c.idCurso];
      return {
        curso: c.nombre,
        docente: doc ? `${doc.nombres} ${doc.apellidos}` : "—",
        items,
        promedio: prom,
      };
    })
    .filter((c) => c.items.length > 0);

  return {
    online: cursos.length > 0 || notas.length > 0,
    totalCursos: cursos.length,
    promedio,
    asistenciaPct,
    pendientesCount: trabajosPendientes.length,
    proximosTrabajos: trabajosPendientes.slice(0, 3).map((t) => ({
      titulo: t.titulo, curso: t.curso, vence: t.vence,
    })),
    calificaciones,
    notasPorCurso,
    trabajosPendientes,
    trabajosCompletados,
  };
}
