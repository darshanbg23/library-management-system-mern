import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import './Layout.css'

function Layout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="sidebar">
        <h2 className="sidebar-title">Library System</h2>
        <ul className="nav-links">
          <li>
            <NavLink to="/" end>Dashboard</NavLink>
          </li>
          <li>
            <NavLink to="/books">Books</NavLink>
          </li>
          <li>
            <NavLink to="/students">Students</NavLink>
          </li>
          <li>
            <NavLink to="/issues">Issue / Return</NavLink>
          </li>
        </ul>
        <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
