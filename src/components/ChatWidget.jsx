import { useState, useRef, useEffect } from "react";
import { enviarMensajeChat } from "../api/services";
import "./ChatWidget.css";

function ChatWidget() {
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mensajes, setMensajes] = useState([
    {
      tipo: "bot",
      texto:
        "Hola Juan, soy tu asistente IA. Pregúntame sobre cursos, tareas, notas o asistencia.",
    },
  ]);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [mensajes, cargando, abierto]);

  const enviar = async () => {
    if (!mensaje.trim() || cargando) return;
    const pregunta = mensaje;
    setMensajes((prev) => [...prev, { tipo: "user", texto: pregunta }]);
    setMensaje("");
    setCargando(true);

    try {
      const data = await enviarMensajeChat(pregunta);
      setMensajes((prev) => [
        ...prev,
        { tipo: "bot", texto: data.respuesta || "No recibí respuesta del servidor." },
      ]);
    } catch {
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
                {msg.texto}
              </div>
            ))}
            {cargando && <div className="chat-message bot">Pensando respuesta...</div>}
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
