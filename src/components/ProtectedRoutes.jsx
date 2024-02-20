import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthProvider";
import Spinner from "./Spinner";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuthContext();

    if (loading) return <Spinner />;

    if (!allowedRoles.includes(user.role)) {
        switch (user.role) {
            case "teacher":
                return <Navigate to="/profile" replace />;
            case "student":
                return <Navigate to="/profile/9054" replace />;
            default:
                return <Navigate to="/login" replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
