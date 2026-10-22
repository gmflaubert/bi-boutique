import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Heart } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { categories } from '../data/initialProducts';

export default function Home() {
  const { getFeaturedProducts } = useProducts();
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-primary to-primary-dark text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <div className="max-w-2xl">
            <p className="text-primary-light text-sm font-medium tracking-widest uppercase mb-4">New Collection 2024</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Elegance,<br />Always Classy
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Discover our curated collection of premium fashion pieces that define your unique style.
              From evening gowns to everyday essentials — crafted for the modern, confident you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2 bg-white !text-primary hover:!bg-gray-100 no-underline">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn-secondary !border-white !text-white hover:!bg-white/20 no-underline">
                Our Story
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Truck, title: 'Fast Delivery', desc: 'Quick and reliable shipping to your doorstep' },
              { icon: Shield, title: 'Quality Guarantee', desc: 'Premium materials and expert craftsmanship' },
              { icon: Heart, title: 'Curated Selection', desc: 'Handpicked pieces for your wardrobe' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <Icon className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="text-base font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-text-light m-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Shop by Category</h2>
            <p className="text-text-light">Find exactly what you're looking for</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.filter(c => c !== 'All').map(cat => (
              <Link
                key={cat}
                to={`/shop?category=${cat}`}
                className="px-6 py-3 bg-white border border-gray-200 rounded-full text-sm font-medium text-text hover:bg-primary hover:text-white hover:border-primary transition-all no-underline"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-text-light">Our most popular pieces this season</p>
            </div>
            <Link to="/shop" className="text-primary font-medium flex items-center gap-1 text-sm no-underline hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featured.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-accent to-accent-dark text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Elevate Your Style?</h2>
          <p className="text-lg text-white/80 mb-8">
            Browse our collection and order directly via WhatsApp. Simple, fast, elegant.
          </p>
          <Link to="/shop" className="btn-primary bg-white !text-accent-dark hover:!bg-gray-100 inline-flex items-center gap-2 no-underline">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
