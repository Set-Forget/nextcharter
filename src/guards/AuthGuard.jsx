import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import Spinner from "../components/Spinner";
import { useAuthContext } from "../context/AuthProvider";

export default function AuthGuard() {
    const { user, loading } = useAuthContext();

    if (loading) return <Spinner />;

    if (!user && !loading) return <Navigate to="/login" replace />;

    const navigation = () => {
        const baseNavigation = [
            { name: "Dashboard", href: "/profile" },
            { name: "Projects", href: "/projects" },
            { name: "Registrations", href: "/registrations" },
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
                return [
                    { name: "Dashboard", href: "/" },
                    { name: "Projects", href: "/projects" },
                ];
            default:
                return [];
        }
    };

    const navItems = navigation();

    return (
        <>
            <Header navItems={navItems} />
            <Outlet />
        </>
    );
}
