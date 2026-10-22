import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import AdminLogin from './pages/admin/Login'
import AdminLayout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminPromos from './pages/admin/Promos'
import { useAuth } from './context/AuthContext'
import { Navigate } from 'react-router-dom'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

export default function App() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="promos" element={<AdminPromos />} />
          </Route>
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}
