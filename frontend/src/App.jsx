// trigger frontend deployment
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthRedirect from "./components/AuthRedirect";

import { setToken } from "./services/api";

export default function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setToken(token);
  }, []);

  return (
    <BrowserRouter>
      <NavBar />

      <Routes>
        {/* Public routes (blocked if logged in) */}
        <Route
          path="/login"
          element={
            <AuthRedirect>
              <Login />
            </AuthRedirect>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthRedirect>
              <Signup />
            </AuthRedirect>
          }
        />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
