import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAuthContext } from "../context/AuthProvider";
import { useMemo } from "react";

export default function Layout() {
    const { session } = useAuthContext();

    const userRole = localStorage.getItem("userRole");

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

        switch (userRole) {
            case "admin":
                return adminNavigation;
            case "teacher":
                return baseNavigation;
            case "student":
                return [{ name: "Projects", href: "/projects" }];
            default:
                return [];
        }
    }, [userRole]);

    return session ? (
        <div className="flex flex-col h-screen">
            <Header navItems={navigation} />
            <Outlet />
        </div>
    ) : (
        <Navigate to="/login" replace />
    );
}
