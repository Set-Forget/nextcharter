import { useMemo } from "react";
import { useAuthContext } from "../context/AuthProvider";
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Spinner from "../components/Spinner";

export default function AuthGuard() {
    const { user, loading } = useAuthContext();

    console.log(user, loading);

    if (loading) return <Spinner />;

    if (!user) return <Navigate to="/login" replace />;

    const navigation = useMemo(() => {
        const baseNavigation = [
            { name: "Dashboard", href: "/profile" },
            { name: "Projects", href: "/projects" },
        ];

        const adminNavigation = [
            { name: "Form", href: "/" },
            { name: "Registrations", href: "/registrations" },
            { name: "Edit Competencies", href: "/editCompetencies" },
            ...baseNavigation,
        ];

        switch (user.role) {
            case "admin":
                return adminNavigation;
            case "teacher":
                return baseNavigation;
            case "student":
                return [{ name: "Projects", href: "/projects" }];
            default:
                return [];
        }
    }, [user.role]);

    return (
        <>
            <Header navItems={navigation} />
            <Outlet />
        </>
    );
}
