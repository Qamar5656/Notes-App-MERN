// src/routes/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken"); // use accessToken

  if (token) return children;

  return <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
