import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { enviarMensajeChat } from "../api/services";
import { useAuth } from "../auth/AuthContext";
import "./ChatWidget.css";

// Preguntas de ejemplo segun el rol (usan lo que el asistente realmente sabe responder).
const SUGERENCIAS = {
  ESTUDIANTE: [
    "¿Qué curso debo reforzar?",
    "¿Tengo tareas pendientes?",
    "¿Cómo va mi asistencia?",
  ],
  DOCENTE: [
    "¿Qué alumnos tienen tareas pendientes?",
    "¿Cómo va el rendimiento de mis cursos?",
  ],
  PADRE: [
    "¿Cómo va mi hijo?",
    "¿Tiene tareas pendientes?",
    "¿Cómo está su asistencia?",
  ],
  ADMIN: [
    "Dame un reporte general de tareas",
    "¿Qué cursos tienen bajo promedio?",
  ],
};

function ChatWidget() {
  const { user } = useAuth();

  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajes, setMensajes] = useState([
    {
      tipo: "bot",
      texto: `Hola ${user?.nombre || "usuario"}, soy tu asistente IA. Pregúntame sobre cursos, tareas, notas o asistencia.`,
    },
  ]);

  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [mensajes, cargando, abierto]);

  // Envia una pregunta. Sin argumento usa lo escrito en el input;
  // los chips de sugerencias pasan su texto directamente.
  const enviar = async (textoDirecto) => {
    const pregunta = (typeof textoDirecto === "string" ? textoDirecto : mensaje).trim();
    if (!pregunta || cargando) return;

    setMensajes((prev) => [...prev, { tipo: "user", texto: pregunta }]);
    setMensaje("");
    setCargando(true);

    try {
      const data = await enviarMensajeChat({
        mensaje: pregunta,
        usuarioId: user?.idUsuario,
        rol: user?.rol,
        idEntidad: user?.idEntidad,
      });

      setMensajes((prev) => [
        ...prev,
        {
          tipo: "bot",
          texto: data.respuesta || "No recibí respuesta del servidor.",
        },
      ]);
    } catch (error) {
      console.error("Error en chat:", error);

      setMensajes((prev) => [
        ...prev,
        {
          tipo: "bot",
          texto:
            "No pude conectarme con el backend. Verifica que Spring Boot esté corriendo y que /api/chat funcione.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      {abierto && (
        <div className="chat-window">
          <div className="chat-header">
            <div>
              <strong>Asistente IA</strong>
              <p>Campus Virtual</p>
            </div>
            <button onClick={() => setAbierto(false)}>×</button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {mensajes.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.tipo}`}>
                {msg.tipo === "bot" ? (
                  <div className="md"><ReactMarkdown>{msg.texto}</ReactMarkdown></div>
                ) : (
                  msg.texto
                )}
              </div>
            ))}
            {cargando && (
              <div className="chat-message bot">Pensando respuesta...</div>
            )}

            {mensajes.length === 1 && !cargando && (SUGERENCIAS[user?.rol] || []).length > 0 && (
              <div className="chat-sugerencias">
                {(SUGERENCIAS[user?.rol] || []).map((q) => (
                  <button key={q} className="chip-sugerencia" onClick={() => enviar(q)}>
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              id="chat-mensaje"
              name="mensaje"
              autoComplete="off"
              value={mensaje}
              placeholder="Escribe tu pregunta..."
              onChange={(e) => setMensaje(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviar()}
            />
            <button onClick={enviar} disabled={cargando}>
              Enviar
            </button>
          </div>
        </div>
      )}

      <button className="chat-btn" onClick={() => setAbierto((v) => !v)}>
        💬
      </button>
    </>
  );
}

export default ChatWidget;