import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userRole = localStorage.getItem("userRole");

    // Redirect based on userRole if it's not allowed
    if (!allowedRoles.includes(userRole)) {
        switch (userRole) {
            case "teacher":
                return <Navigate to="/profile" replace />;
            case "student":
                return <Navigate to="/profile/9054" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    return children; // User role is allowed, render the children
};

export default ProtectedRoute;
