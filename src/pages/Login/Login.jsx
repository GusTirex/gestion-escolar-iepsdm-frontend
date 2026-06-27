import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, HOME_BY_ROLE } from "../../auth/AuthContext";
import { login as loginApi } from "../../api/services";
import "./Login.css";

// Accesos rapidos a las cuentas sembradas (demo).
const DEMO = [
  { usuario: "juanperez", rol: "Estudiante", icon: "🎓" },
  { usuario: "carlosramos", rol: "Docente", icon: "📚" },
  { usuario: "padrejuan", rol: "Padre", icon: "👨‍👩‍👦" },
  { usuario: "admin", rol: "Admin", icon: "🛠️" },
];

function Login() {
  const { iniciarSesion } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const entrar = async (nombreUsuario, clave) => {
    setError("");
    setCargando(true);
    try {
      const user = await loginApi(nombreUsuario, clave);
      if (!user) {
        setError("Usuario o contraseña incorrectos.");
        return;
      }
      iniciarSesion(user);
      navigate(HOME_BY_ROLE[user.rol] || "/", { replace: true });
    } catch {
      setError("No se pudo conectar con el servidor. ¿El backend está corriendo?");
    } finally {
      setCargando(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!usuario.trim() || !password) {
      setError("Ingresa tu usuario y contraseña.");
      return;
    }
    entrar(usuario.trim(), password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <h1>Campus Virtual</h1>
          <p>IEPSDM · Sistema de Gestión Escolar</p>
        </div>

        <form onSubmit={onSubmit} className="login-form">
          <label className="field">
            Usuario o correo
            <input
              id="login-usuario"
              name="usuario"
              autoComplete="username"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="usuario o correo@colegio.edu.pe"
            />
          </label>
          <label className="field">
            Contraseña
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </label>

          {error && <p className="login-error">{error}</p>}

          <button className="btn-primary login-submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-demo">
          <span>Acceso rápido (demo · contraseña 123456):</span>
          <div className="login-demo-grid">
            {DEMO.map((d) => (
              <button key={d.usuario} className="demo-btn" disabled={cargando} onClick={() => entrar(d.usuario, "123456")}>
                <span className="demo-ic">{d.icon}</span>
                {d.rol}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
