import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Users, Truck, Shield, Send } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { ContactForm, Product } from '../types';
import { fetchProducts, ApiProduct } from '../lib/api';

const Home: React.FC = () => {
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoadingProducts(true);
      try {
        const list = await fetchProducts();
        setApiProducts(list);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    load();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setContactForm({ name: '', email: '', message: '' });
    setIsSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Découvrez Votre
              <span className="block text-yellow-300">Catalogue Digital</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">Une expérience d'achat moderne, intuitive et personnalisée</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/catalogue" className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg">
                Découvrir le catalogue
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white bg-opacity-20 rounded-full"
              initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
              animate={{ y: -100, opacity: [0, 1, 0] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, delay: Math.random() * 2 }}
            />
          ))}
        </div>
      </section>

      {/* All Products from API */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Tous les produits</h2>
            <p className="text-xl text-gray-600">Affichés en direct depuis votre base de données</p>
          </motion.div>

          {isLoadingProducts ? (
            <div className="text-center py-12 text-gray-600">Chargement des produits...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {apiProducts.map((p, index) => {
                const mapped: Product = {
                  id: p.id_produit,
                  name: p.nom,
                  description: p.description || '',
                  price: p.prix,
                  images: [p.qr_code_path || '/placeholder-product.jpg'],
                  category: p.categorie?.nom || 'Inconnu',
                  brand: p.marque?.nom || 'Inconnu',
                  rating: 4.3,
                  isNew: false,
                  stock: p.stock,
                  specifications: {},
                  reviews: [],
                };
                return <ProductCard key={p.id_produit} product={mapped} index={index} />;
              })}
            </div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mt-12">
            <Link to="/catalogue" className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary transition-colors duration-300">
              Voir tous les filtres
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Pourquoi Nous Choisir ?</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShoppingBag, title: 'Large Sélection', description: 'Plus de 1000 produits de qualité soigneusement sélectionnés pour vous.' },
              { icon: Truck, title: 'Livraison Rapide', description: 'Livraison gratuite en 24-48h partout en France métropolitaine.' },
              { icon: Shield, title: 'Paiement Sécurisé', description: 'Tous vos paiements sont protégés par un cryptage de niveau bancaire.' },
            ].map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.2 }} className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Ce Que Disent Nos Clients</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sophie Martin', comment: 'Service exceptionnel et produits de qualité. Je recommande vivement !', rating: 5 },
              { name: 'Thomas Dubois', comment: 'Interface moderne et intuitive. Commande reçue rapidement.', rating: 5 },
              { name: 'Marie Leclerc', comment: 'Large choix de produits et prix compétitifs. Très satisfaite !', rating: 4 },
            ].map((testimonial, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.2 }} className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Contactez-Nous</h2>
              <p className="text-xl text-blue-100 mb-8">Une question ? Besoin d'aide ? Notre équipe est là pour vous accompagner.</p>
              <div className="space-y-4">
                <div className="flex items-center"><Users className="w-6 h-6 mr-3 text-blue-200" /><span>Équipe dédiée et réactive</span></div>
                <div className="flex items-center"><Shield className="w-6 h-6 mr-3 text-blue-200" /><span>Support technique sécurisé</span></div>
                <div className="flex items-center"><Star className="w-6 h-6 mr-3 text-blue-200" /><span>Service client 5 étoiles</span></div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-white bg-opacity-10 p-8 rounded-xl backdrop-blur-sm">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Message envoyé !</h3>
                  <p className="text-blue-100">Nous vous répondrons dans les plus brefs délais.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <input type="text" name="name" value={contactForm.name} onChange={handleContactChange} placeholder="Votre nom" required className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-white placeholder-blue-200" />
                  </div>
                  <div>
                    <input type="email" name="email" value={contactForm.email} onChange={handleContactChange} placeholder="Votre email" required className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-white placeholder-blue-200" />
                  </div>
                  <div>
                    <textarea name="message" value={contactForm.message} onChange={handleContactChange} placeholder="Votre message" rows={4} required className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-white placeholder-blue-200 resize-none" />
                  </div>
                  <motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;