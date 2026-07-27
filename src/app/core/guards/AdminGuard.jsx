import { Navigate } from "react-router-dom";

export default function AdminGuard({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  console.log("AdminGuard user:", user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}