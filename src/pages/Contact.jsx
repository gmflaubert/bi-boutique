import { Mail, MapPin, Phone, MessageCircle, Search, ShoppingBag, CreditCard, Package, CheckCircle } from 'lucide-react'
import { STORE_CONFIG } from '../config'

function InstagramIcon({ size = 24 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><circle cx="12" cy="12" r="5"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.51"/>
    </svg>
  )
}

export default function Contact() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 text-white text-center" style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))' }}>
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Get in Touch</h1>
          <p className="opacity-90 text-lg">We'd love to hear from you</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: Phone, label: 'Phone', value: '+250 780 000 000' },
              { icon: MessageCircle, label: 'WhatsApp', value: '+250 780 000 000' },
              { icon: Mail, label: 'Email', value: STORE_CONFIG.email },
              { icon: InstagramIcon, label: 'Instagram', value: STORE_CONFIG.instagram },
            ].map(item => (
              <div key={item.label} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-primary)' }}>
                  <item.icon size={24} />
                </div>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>{item.label}</h3>
                <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{item.value}</p>
              </div>
            ))}
          </div>

          {/* How to Order */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}>
              How to Order
            </h2>
            <div className="space-y-6">
              {[
                { num: 1, icon: Search, title: 'Browse', desc: 'Explore our collection and find pieces you love.' },
                { num: 2, icon: ShoppingBag, title: 'Select', desc: 'Choose your size, color, and quantity.' },
                { num: 3, icon: MessageCircle, title: 'Order via WhatsApp', desc: 'Click "Order via WhatsApp" to send your order directly.' },
                { num: 4, icon: CreditCard, title: 'Pay', desc: 'We\'ll share payment details and confirm your order.' },
                { num: 5, icon: Package, title: 'Receive', desc: 'Your order is prepared and delivered to your doorstep.' },
              ].map(step => (
                <div key={step.num} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm" style={{ backgroundColor: 'var(--color-primary)' }}>
                    {step.num}
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>{step.title}</h3>
                    <p className="text-sm" style={{ color: 'var(--color-text-light)' }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
