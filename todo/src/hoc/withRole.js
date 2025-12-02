import React from "react";
import { Navigate } from "react-router-dom";

const withRole =
  (allowedRoles = []) =>
  (WrappedComponent) => {
    return (props) => {
      const token = localStorage.getItem("accessToken");
      const user = JSON.parse(localStorage.getItem("user"));

      // Not logged in redirect to SignIn
      if (!token || !user) return <Navigate to="/signin" replace />;

      // Role not allowed redirect to unauthorized
      if (!allowedRoles.includes(user.role))
        return <Navigate to="/unauthorized" replace />;

      // User allowed render component
      return <WrappedComponent {...props} />;
    };
  };

export default withRole;
