import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function ProtectedRoute({ children, requireAdmin }) {
  const { token, role } = useAuthStore();

  if (!token) return <Navigate to="/login" replace />;
  if (requireAdmin && role !== "admin") return <Navigate to="/" replace />;

  return <>{children}</>;
}
