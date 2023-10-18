import { Outlet } from 'react-router-dom'
import Header from "../components/Header"

// CONSTANTS
const navigation = [
  { name: 'Loading Form', href: '/nextcharter/' },
  { name: 'Uploaded Students', href: '/nextcharter/dashboard' },
]

export default function Layout() {
  return(
    <div className="flex flex-col h-screen">
      <Header navItems={navigation} />
      <Outlet />
    </div>
  )
}