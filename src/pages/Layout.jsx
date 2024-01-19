<<<<<<< HEAD
import { Navigate, Outlet } from 'react-router-dom'
import Header from "../components/Header"
import { useAuthContext } from '../context/AuthProvider'
import { useMemo } from 'react';


// // Function to determine navigation based on user role
// const getNavigation = () => {
//   let userRole = localStorage.getItem('userRole');
//   const baseNavigation = [
//     { name: 'Profile', href: '/profile' },
//   ];

//   const adminNavigation = [
//     { name: 'Form', href: '/' },
//     { name: 'Registrations', href: '/registrations' },
//     { name: 'Edit Competencies', href: '/editCompetencies' },
//     ...baseNavigation, // Include base navigation items
//   ];

//   switch (userRole) {
//     case 'admin':
//       return adminNavigation;
//     case 'teacher':
//       return baseNavigation;
//     case 'student':
//     default:
//       return []; // Return empty array for students or undefined roles
//   }
// };

// Use the function to set navigation
// const navigation = getNavigation(userRole);
=======
import { Navigate, Outlet } from "react-router-dom";
import Header from "../components/Header";
import { useAuthContext } from "../context/AuthProvider";

// CONSTANTS
const navigation = [
    { name: "Form", href: "/" },
    { name: "Registrations", href: "/registrations" },
    { name: "Profile", href: "/profile" },
    { name: "Edit Competencies", href: "/editCompentencies" },
    //{ name: "Projects", href: "/projects" },
];
>>>>>>> 90d1d8529c5d21e2941d7fe0a45a891185b29d84

export default function Layout() {
    const { session } = useAuthContext();

<<<<<<< HEAD
  const userRole = localStorage.getItem('userRole');

  // useMemo to memorize navigation items
  const navigation = useMemo(() => {
    const baseNavigation = [
      { name: 'Profile', href: '/profile' },
    ];

    const adminNavigation = [
      { name: 'Form', href: '/' },
      { name: 'Registrations', href: '/registrations' },
      { name: 'Edit Competencies', href: '/editCompetencies' },
      ...baseNavigation, // Include base navigation items
    ];

    switch (userRole) {
      case 'admin':
        return adminNavigation;
      case 'teacher':
        return baseNavigation;
      case 'student':
      default:
        return []; // Return empty array for students or undefined roles
    }
  }, [userRole]);

  return(
    session ? (
      <div className="flex flex-col h-screen">
        <Header navItems={navigation} />
        <Outlet />
      </div>
=======
    return session ? (
        <div className="flex flex-col h-screen">
            <Header navItems={navigation} />
            <Outlet />
        </div>
>>>>>>> 90d1d8529c5d21e2941d7fe0a45a891185b29d84
    ) : (
        <Navigate to="/login" replace />
    );
}
