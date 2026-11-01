import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react'
import { STORE_CONFIG } from '../config'

function InstagramIcon({ size = 24 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
    </svg>
  )
}

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1a1a2e', color: '#d1d5db' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpg" alt={STORE_CONFIG.storeName} className="h-10 w-10 rounded-full object-cover" />
              <div>
                <h3 className="text-white font-semibold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>{STORE_CONFIG.storeName}</h3>
                <p className="text-xs" style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>{STORE_CONFIG.tagline}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Your destination for curated fashion that blends elegance with modern style.
              Every piece is handpicked to make you feel confident and beautiful.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Quick Links</h4>
            <ul className="space-y-2 text-sm list-none p-0">
              <li><Link to="/" className="hover:text-white transition-colors no-underline" style={{ color: '#d1d5db' }}>Home</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors no-underline" style={{ color: '#d1d5db' }}>Shop</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors no-underline" style={{ color: '#d1d5db' }}>About Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors no-underline" style={{ color: '#d1d5db' }}>Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Contact Us</h4>
            <ul className="space-y-2 text-sm list-none p-0">
              <li className="flex items-center gap-2"><Phone size={16} /> +250 788 975 846</li>
              <li className="flex items-center gap-2"><MessageCircle size={16} /> WhatsApp</li>
              <li className="flex items-center gap-2"><Mail size={16} /> {STORE_CONFIG.email}</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> {STORE_CONFIG.address}</li>
              <li className="flex items-center gap-2"><InstagramIcon size={16} /> {STORE_CONFIG.instagram}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {STORE_CONFIG.storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
