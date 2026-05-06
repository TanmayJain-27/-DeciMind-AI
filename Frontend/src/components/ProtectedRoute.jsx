import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Admin-only route
  if (adminOnly && role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;