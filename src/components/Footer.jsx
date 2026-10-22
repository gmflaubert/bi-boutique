import { Link } from 'react-router-dom';
import { AtSign, Mail, MapPin, Phone } from 'lucide-react';
import { storeSettings } from '../data/initialProducts';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.jpg" alt="B&I Boutique" className="h-12 w-auto rounded" />
              <div>
                <h3 className="text-white text-lg m-0">B&I Boutique</h3>
                <p className="text-accent text-sm m-0">{storeSettings.tagline}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Your destination for elegant and classy fashion. We bring you the finest selection
              of clothing and accessories curated with love.
            </p>
          </div>

          <div>
            <h3 className="text-white text-lg mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-gray-300 hover:text-primary transition-colors text-sm no-underline">Home</Link>
              <Link to="/shop" className="text-gray-300 hover:text-primary transition-colors text-sm no-underline">Shop</Link>
              <Link to="/about" className="text-gray-300 hover:text-primary transition-colors text-sm no-underline">About Us</Link>
              <Link to="/contact" className="text-gray-300 hover:text-primary transition-colors text-sm no-underline">Contact</Link>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <a href={`tel:+${storeSettings.whatsappNumber}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors no-underline">
                <Phone size={16} /> +{storeSettings.whatsappNumber}
              </a>
              <a href={`mailto:${storeSettings.email}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors no-underline">
                <Mail size={16} /> {storeSettings.email}
              </a>
              <span className="flex items-center gap-2 text-sm">
                <MapPin size={16} /> {storeSettings.address}
              </span>
              <span className="flex items-center gap-2 text-sm">
                <AtSign size={16} /> {storeSettings.instagram}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p className="m-0">&copy; {new Date().getFullYear()} B&I Boutique. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
