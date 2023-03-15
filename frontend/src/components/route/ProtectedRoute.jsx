import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  if (loading === false && isAuthenticated === false) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
