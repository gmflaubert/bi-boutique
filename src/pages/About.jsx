import { Heart, Star, Users } from 'lucide-react';

export default function About() {
  return (
    <div>
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Our Story</h1>
          <p className="text-lg text-white/80">Where elegance meets everyday style</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img src="/logo.jpg" alt="B&I Boutique" className="w-full max-w-sm mx-auto rounded-xl shadow-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4">About B&I Boutique</h2>
              <p className="text-text-light leading-relaxed mb-4">
                B&I Boutique was born from a passion for making elegant fashion accessible to everyone.
                We believe that looking your best shouldn't be complicated or overwhelming.
              </p>
              <p className="text-text-light leading-relaxed mb-4">
                Our curated collection features handpicked pieces that blend timeless elegance
                with modern trends. From stunning evening gowns to everyday essentials,
                every item is chosen with care and an eye for quality.
              </p>
              <p className="text-text-light leading-relaxed">
                We make shopping simple — browse our collection, pick what you love,
                and order directly through WhatsApp. No complicated checkouts,
                just a personal shopping experience.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Passion for Fashion', desc: 'Every piece in our collection is handpicked with love and a keen eye for quality and style.' },
              { icon: Star, title: 'Quality First', desc: 'We partner with trusted suppliers to bring you premium materials and expert craftsmanship.' },
              { icon: Users, title: 'Personal Service', desc: 'We offer a personal shopping experience through direct WhatsApp communication.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-primary" size={28} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-text-light">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
