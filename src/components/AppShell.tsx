import { Link, NavLink, Outlet } from 'react-router'
import { CustomersIcon, DashboardIcon, LogoMark, OrdersIcon, SettingsIcon } from '@wrenmoor/ui'
import './AppShell.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: <DashboardIcon />, end: true },
  { to: '/orders', label: 'Orders', icon: <OrdersIcon />, end: false },
  { to: '/customers', label: 'Customers', icon: <CustomersIcon />, end: false },
  { to: '/settings', label: 'Settings', icon: <SettingsIcon />, end: false },
]

export function AppShell() {
  return (
    <div className="shell">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header className="topbar no-print">
        <Link to="/" className="topbar__brand">
          <LogoMark />
          <span>
            Wrenmoor <span className="topbar__product">Orders</span>
          </span>
        </Link>
        <div className="topbar__user">
          <span className="topbar__avatar" aria-hidden="true">
            PR
          </span>
          <span>
            <span className="topbar__name">Priya Raman</span>
            <span className="topbar__role">Operations lead</span>
          </span>
        </div>
      </header>
      <nav className="sidebar no-print" aria-label="Primary">
        <ul className="sidebar__list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className="sidebar__link">
                {item.icon}
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <main id="main" className="content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
