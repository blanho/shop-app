import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading === false && isAuthenticated === false) {
    return <Navigate to="/" />;
  }
  if (loading === false && isAdmin === true && user.role !== "admin") {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
