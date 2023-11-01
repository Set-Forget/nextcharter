import { Outlet } from 'react-router-dom'
import Header from "../components/Header"

// CONSTANTS
const navigation = [
  { name: 'Form', href: '/' },
  { name: 'Registrations', href: '/registrations' },
  { name: 'Profile', href: '/profile' },
]

export default function Layout() {
  return(
    <div className="flex flex-col h-screen">
      <Header navItems={navigation} />
      <Outlet />
    </div>
  )
}