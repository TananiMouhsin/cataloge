import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-accent">Catalogue Digital</h3>
            <p className="text-gray-400 mb-4">
              Votre destination pour découvrir les meilleurs produits avec une expérience d'achat moderne et intuitive.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-400">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">123 Rue Commerce, Paris 75001</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Phone className="w-4 h-4 mr-2" />
                <span className="text-sm">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm">contact@catalogue-digital.fr</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              {['À propos', 'Catalogue', 'Contact', 'CGV', 'Politique de confidentialité'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2">
              {['Électronique', 'Mode', 'Maison', 'Sports', 'Beauté'].map((category) => (
                <li key={category}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-4 text-sm">
              Inscrivez-vous pour recevoir nos dernières offres et nouveautés.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre email..."
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white placeholder-gray-400"
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-accent hover:bg-accent/80 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <Send className="w-4 h-4 mr-2" />
                {subscribed ? 'Inscrit !' : "S'inscrire"}
              </motion.button>
            </form>
            
            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: Facebook, href: '#' },
                { icon: Twitter, href: '#' },
                { icon: Instagram, href: '#' },
              ].map(({ icon: Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="text-gray-400 hover:text-accent transition-colors duration-200"
                >
                  <Icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Catalogue Digital Interactif. Tous droits réservés.
            </p>
            <p className="text-gray-400 text-sm mt-2 md:mt-0">
              Développé avec ❤️ en France
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;