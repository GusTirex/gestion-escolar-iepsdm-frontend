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

// ---- Notificaciones dentro de la app ----
// El backend identifica al usuario por su token, no hace falta mandar el id.
export const getNotificaciones = () => safeGet("/notificaciones");

export async function marcarTodasLeidas() {
  try {
    await api.put("/notificaciones/leer-todas");
  } catch {
    /* si falla, no rompe la UI */
  }
}

// ---- Entrega de trabajos (real, guardada en la BD) ----
export async function getEntregasEstudiante(idEstudiante) {
  const entregas = await safeGet(`/entregas?idEstudiante=${idEstudiante}`);
  return entregas.map((e) => ({
    idEvaluacion: e.idEvaluacion,
    titulo: e.titulo,
    curso: e.curso,
    vence: fmtFecha(e.vence),
    fechaEntrega: e.fechaEntrega,
  }));
}

export async function crearEntrega(idEstudiante, idEvaluacion) {
  const { data } = await api.post("/entregas", { idEstudiante, idEvaluacion });
  return data;
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
// El servidor ya devuelve el resumen calculado (una sola llamada).
// Antes se descargaban tablas completas y se cruzaban aqui en el navegador.
export async function getDatosAcademicos(idEstudiante) {
  let r;
  try {
    const { data } = await api.get(`/estudiantes/${idEstudiante}/resumen`);
    r = data;
  } catch {
    return { online: false };
  }

  const conFecha = (t) => {
    const dias = diasRestantes(t.vence);
    return {
      idEvaluacion: t.idEvaluacion,
      titulo: t.titulo,
      curso: t.curso,
      nota: t.nota,
      vence: fmtFecha(t.vence),
      restantes: dias != null ? (dias >= 0 ? `${dias} días restantes` : "Vencido") : "",
    };
  };

  const trabajosPendientes = (r.trabajosPendientes || []).map(conFecha);
  const trabajosCompletados = (r.trabajosCompletados || []).map(conFecha);

  return {
    online: true,
    totalCursos: r.totalCursos ?? 0,
    promedio: r.promedio ?? 0,
    asistenciaPct: r.asistenciaPct ?? 0,
    pendientesCount: trabajosPendientes.length,
    proximosTrabajos: trabajosPendientes.slice(0, 3).map((t) => ({
      titulo: t.titulo, curso: t.curso, vence: t.vence,
    })),
    calificaciones: trabajosCompletados.slice(0, 4).map((t) => ({
      curso: t.curso, detalle: t.titulo, nota: t.nota,
    })),
    notasPorCurso: (r.notasPorCurso || []).map((c) => ({
      curso: c.curso,
      docente: c.docente,
      promedio: c.promedio,
      items: (c.items || []).map((i) => ({ evaluacion: i.evaluacion, nota: i.nota })),
    })),
    trabajosPendientes,
    trabajosCompletados,
  };
}
