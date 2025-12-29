import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  // Not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
