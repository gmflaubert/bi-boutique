import { Phone, Mail, MapPin, AtSign, MessageCircle } from 'lucide-react';
import { storeSettings } from '../data/initialProducts';

export default function Contact() {
  const whatsappUrl = `https://wa.me/${storeSettings.whatsappNumber}`;

  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Get in Touch</h1>
          <p className="text-lg text-white/80">We'd love to hear from you</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <a href={`tel:+${storeSettings.whatsappNumber}`} className="flex items-start gap-4 text-text no-underline hover:text-primary transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-base">Phone</h3>
                    <p className="text-text-light text-sm m-0">+{storeSettings.whatsappNumber}</p>
                  </div>
                </a>

                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 text-text no-underline hover:text-primary transition-colors">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="text-green-600" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-base">WhatsApp</h3>
                    <p className="text-text-light text-sm m-0">Chat with us directly</p>
                  </div>
                </a>

                <a href={`mailto:${storeSettings.email}`} className="flex items-start gap-4 text-text no-underline hover:text-primary transition-colors">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="text-primary" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-base">Email</h3>
                    <p className="text-text-light text-sm m-0">{storeSettings.email}</p>
                  </div>
                </a>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-base">Location</h3>
                    <p className="text-text-light text-sm m-0">{storeSettings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center shrink-0">
                    <AtSign className="text-pink-500" size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1 text-base">Instagram</h3>
                    <p className="text-text-light text-sm m-0">{storeSettings.instagram}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">How to Order</h2>
              <div className="space-y-6">
                {[
                  { step: '1', title: 'Browse', desc: 'Explore our collection and find items you love' },
                  { step: '2', title: 'Select', desc: 'Choose your size, color, and add to cart' },
                  { step: '3', title: 'Order', desc: 'Scan the QR code or click to open WhatsApp' },
                  { step: '4', title: 'Pay', desc: 'Complete payment using the provided account details' },
                  { step: '5', title: 'Receive', desc: 'Your order will be shipped to your doorstep' },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold shrink-0 text-sm">
                      {step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">{title}</h3>
                      <p className="text-sm text-text-light m-0">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
