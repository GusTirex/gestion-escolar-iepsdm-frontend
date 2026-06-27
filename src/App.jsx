import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Inicio from "./pages/Inicio/Inicio";
import Notas from "./pages/Notas/Notas";
import Trabajos from "./pages/Trabajos/Trabajos";
import Temas from "./pages/Temas/Temas";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/notas" element={<Notas />} />
        <Route path="/trabajos" element={<Trabajos />} />
        <Route path="/temas" element={<Temas />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
