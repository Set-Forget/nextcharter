import { Outlet } from 'react-router-dom'
import Header from "../components/Header"

// CONSTANTS
const navigation = [
  { name: 'Form', href: '/' },
  { name: 'Registrations', href: '/registrations' },
  { name: 'Progress by Student', href: '/student-progress' },
]

export default function Layout() {
  return(
    <div className="flex flex-col h-screen">
      <Header navItems={navigation} />
      <Outlet />
    </div>
  )
}