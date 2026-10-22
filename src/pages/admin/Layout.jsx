import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingCart, Tag, ArrowLeft, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { STORE_CONFIG } from '../../config'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/promos', label: 'Discounts & Promos', icon: Tag },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.to
    return location.pathname.startsWith(item.to)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-40 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt={STORE_CONFIG.storeName} className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h2 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>{STORE_CONFIG.storeName}</h2>
              <p className="text-xs" style={{ color: 'var(--color-accent)' }}>Admin Panel</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors no-underline"
              style={{
                backgroundColor: isActive(item) ? 'var(--color-bg)' : 'transparent',
                color: isActive(item) ? 'var(--color-primary)' : 'var(--color-text-light)',
              }}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium no-underline" style={{ color: 'var(--color-text-light)' }}>
            <ArrowLeft size={18} /> Back to Store
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium w-full cursor-pointer"
            style={{ color: '#ef4444', background: 'none', border: 'none', fontFamily: 'var(--font-body)' }}
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-bold text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="p-2 rounded-lg no-underline"
              style={{ color: isActive(item) ? 'var(--color-primary)' : 'var(--color-text-light)' }}
            >
              <item.icon size={18} />
            </Link>
          ))}
          <Link to="/" className="p-2 no-underline" style={{ color: 'var(--color-text-light)' }}><ArrowLeft size={18} /></Link>
          <button onClick={handleLogout} className="p-2 cursor-pointer" style={{ color: '#ef4444', background: 'none', border: 'none' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="md:ml-64 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
