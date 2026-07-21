import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth, HOME_BY_ROLE } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";
import Layout from "./components/Layout";
import ErrorBoundary from "./components/ErrorBoundary";
import Login from "./pages/Login/Login";

// Cada portal se descarga solo cuando se entra a el (code splitting),
// asi la primera carga del sistema es mas liviana.

// Portal estudiante
const Inicio = lazy(() => import("./pages/Inicio/Inicio"));
const Notas = lazy(() => import("./pages/Notas/Notas"));
const Trabajos = lazy(() => import("./pages/Trabajos/Trabajos"));
const Temas = lazy(() => import("./pages/Temas/Temas"));

// Portal docente
const DocenteDashboard = lazy(() => import("./pages/docente/Dashboard"));
const DocenteCursos = lazy(() => import("./pages/docente/Cursos"));
const DocenteNotas = lazy(() => import("./pages/docente/Notas"));
const DocenteAsistencia = lazy(() => import("./pages/docente/Asistencia"));

// Portal padre
const PadreDashboard = lazy(() => import("./pages/padre/Dashboard"));
const PadreNotas = lazy(() => import("./pages/padre/Notas"));
const PadreAsistencia = lazy(() => import("./pages/padre/Asistencia"));

// Portal admin
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminGestion = lazy(() => import("./pages/admin/Gestion"));

function RootRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? HOME_BY_ROLE[user.rol] || "/login" : "/login"} replace />;
}

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="loader" />}>
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
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
