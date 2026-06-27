import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, HOME_BY_ROLE } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./components/Layout";
import Login from "./pages/Login/Login";

// Portal estudiante
import Inicio from "./pages/Inicio/Inicio";
import Notas from "./pages/Notas/Notas";
import Trabajos from "./pages/Trabajos/Trabajos";
import Temas from "./pages/Temas/Temas";

// Portal docente
import DocenteDashboard from "./pages/docente/Dashboard";
import DocenteCursos from "./pages/docente/Cursos";
import DocenteNotas from "./pages/docente/Notas";
import DocenteAsistencia from "./pages/docente/Asistencia";

// Portal padre
import PadreDashboard from "./pages/padre/Dashboard";
import PadreNotas from "./pages/padre/Notas";
import PadreAsistencia from "./pages/padre/Asistencia";

// Portal admin
import AdminDashboard from "./pages/admin/Dashboard";
import AdminGestion from "./pages/admin/Gestion";

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? HOME_BY_ROLE[user.rol] || "/login" : "/login"} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<RequireAuth roles={["ESTUDIANTE"]} />}>
        <Route element={<Layout />}>
          <Route path="/estudiante" element={<Inicio />} />
          <Route path="/estudiante/notas" element={<Notas />} />
          <Route path="/estudiante/trabajos" element={<Trabajos />} />
          <Route path="/estudiante/temas" element={<Temas />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={["DOCENTE"]} />}>
        <Route element={<Layout />}>
          <Route path="/docente" element={<DocenteDashboard />} />
          <Route path="/docente/cursos" element={<DocenteCursos />} />
          <Route path="/docente/notas" element={<DocenteNotas />} />
          <Route path="/docente/asistencia" element={<DocenteAsistencia />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={["PADRE"]} />}>
        <Route element={<Layout />}>
          <Route path="/padre" element={<PadreDashboard />} />
          <Route path="/padre/notas" element={<PadreNotas />} />
          <Route path="/padre/asistencia" element={<PadreAsistencia />} />
        </Route>
      </Route>

      <Route element={<RequireAuth roles={["ADMIN"]} />}>
        <Route element={<Layout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/gestion" element={<AdminGestion />} />
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
