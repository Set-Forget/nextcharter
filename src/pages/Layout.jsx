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

export default function Layout() {
  const { session } = useAuthContext()

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
    ) : (
      <Navigate to="/login" replace />
    )
  )
}