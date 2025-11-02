import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Minimal ProtectedRoute: if no user, redirect to /login
export default function ProtectedRoute({ children }) {
  const auth = useAuth();
  const user = auth?.user;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
