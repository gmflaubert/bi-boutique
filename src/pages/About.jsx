import { Heart, Sparkles, Shield } from 'lucide-react'
import { STORE_CONFIG } from '../config'

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 text-white text-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Our Story</h1>
          <p className="opacity-90 text-lg">Discover the heart and soul behind {STORE_CONFIG.storeName}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="flex justify-center">
              <img src="/logo.jpg" alt={STORE_CONFIG.storeName} className="w-64 h-64 rounded-2xl object-cover shadow-lg" />
            </div>
            <div className="space-y-4" style={{ color: 'var(--color-text)' }}>
              <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Who We Are</h2>
              <p style={{ color: 'var(--color-text-light)' }}>
                B&I Boutique was founded with a simple mission: to make every woman feel beautiful,
                confident, and classy. We believe that fashion is more than clothing — it's a form
                of self-expression that speaks before you do.
              </p>
              <p style={{ color: 'var(--color-text-light)' }}>
                Based in Kigali, Rwanda, we carefully curate our collection from designers who share our
                vision of elegance and quality. Every piece in our store is handpicked to ensure it meets
                our standards of craftsmanship, style, and comfort.
              </p>
              <p style={{ color: 'var(--color-text-light)' }}>
                Whether you're dressing for a boardroom meeting, a weekend brunch, or a glamorous evening
                event, B&I Boutique has the perfect piece waiting for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Passion for Fashion', desc: 'We pour our heart into every selection, ensuring each piece tells a story of elegance.' },
              { icon: Shield, title: 'Quality First', desc: 'Only the finest materials and craftsmanship make it into our collection.' },
              { icon: Sparkles, title: 'Personal Service', desc: 'Every customer is special. We provide personalized styling guidance via WhatsApp.' },
            ].map(v => (
              <div key={v.title} className="card p-8 text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)' }}>
                  <v.icon size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
                  {v.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
