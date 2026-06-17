import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth, selectRole } from "../../store/slices/authSlice.js";

// Redirect to login if not authenticated
export const PrivateRoute = ({ children }) => {
  const isAuth = useSelector(selectIsAuth);
  const location = useLocation();
  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

// Only allow specific roles
export const RoleRoute = ({ children, roles }) => {
  const isAuth = useSelector(selectIsAuth);
  const role = useSelector(selectRole);
  const location = useLocation();
  if (!isAuth) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!roles.includes(role)) return <Navigate to="/dashboard" replace />;
  return children;
};

// Redirect to dashboard if already logged in (for /login, /register)
export const GuestRoute = ({ children }) => {
  const isAuth = useSelector(selectIsAuth);
  if (isAuth) return <Navigate to="/dashboard" replace />;
  return children;
};
