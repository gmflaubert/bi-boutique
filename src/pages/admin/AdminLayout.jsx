import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Percent, LogOut, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/promos', icon: Percent, label: 'Discounts & Promos' },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen overflow-y-auto hidden md:block">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="B&I Boutique" className="h-10 w-auto rounded" />
            <div>
              <h2 className="text-sm font-bold text-primary m-0">B&I Boutique</h2>
              <p className="text-xs text-text-light m-0">Admin Portal</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-text-light hover:bg-gray-50 hover:text-text'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          <NavLink
            to="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-text-light hover:text-text hover:bg-gray-50 no-underline mb-1"
          >
            <ChevronLeft size={18} />
            Back to Store
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 w-full bg-transparent border-none cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="" className="h-8 w-auto rounded" />
            <span className="text-sm font-bold text-primary">Admin</span>
          </div>
          <button onClick={handleLogout} className="text-red-500 bg-transparent border-none cursor-pointer">
            <LogOut size={18} />
          </button>
        </div>
        <div className="flex gap-1 mt-3 overflow-x-auto pb-1">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap no-underline ${
                  isActive ? 'bg-primary text-white' : 'bg-gray-100 text-text-light'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-24 md:pt-0">
        <div className="p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
