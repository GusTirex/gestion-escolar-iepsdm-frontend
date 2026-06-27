import { Navigate, Outlet } from "react-router-dom";
import { useAuth, HOME_BY_ROLE } from "./AuthContext";

// Exige sesion iniciada. Si se pasan roles, exige que el usuario tenga uno de ellos.
function RequireAuth({ roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.rol)) {
    return <Navigate to={HOME_BY_ROLE[user.rol] || "/login"} replace />;
  }
  return <Outlet />;
}

export default RequireAuth;
