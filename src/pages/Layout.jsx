import { Navigate, Outlet } from 'react-router-dom'
import Header from "../components/Header"
import { useAuthContext } from '../context/AuthProvider'

// CONSTANTS
const navigation = [
  { name: 'Form', href: '/' },
  { name: 'Registrations', href: '/registrations' },
  { name: 'Profile', href: '/profile' },
  { name: 'Edit Competencies', href: '/editCompentencies' },
]

export default function Layout() {
  const { session } = useAuthContext()

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