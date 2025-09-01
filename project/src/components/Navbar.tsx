import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, User, Menu, X, Search, LogOut } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import CartPanel from './CartPanel';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, isOpen, openCart, closeCart } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/catalogue', label: 'Catalogue' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <motion.div
                className="text-2xl font-bold text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="inline-block w-8 h-8 mr-2" />
                Catalogue Digital
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-gray-600 hover:text-primary'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Bonjour, {user.name}</span>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
                  >
                    <span className="text-sm">Admin</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-gray-600 hover:text-primary transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-gray-600 hover:text-primary transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm">Connexion</span>
                </Link>
              )}
              
              <button 
                onClick={openCart}
                className="relative p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-primary"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t bg-white"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-3 py-2 text-base font-medium rounded-md ${
                      isActive(item.path)
                        ? 'text-primary bg-blue-50'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <div className="border-t pt-2 mt-2">
                  {user ? (
                    <div className="px-3 py-2">
                      <p className="text-sm text-gray-600">Bonjour, {user.name}</p>
                      <Link
                        to="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md"
                      >
                        Admin
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="mt-2 text-sm text-red-600"
                      >
                        Se déconnecter
                      </button>
                    </div>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md"
                    >
                      <User className="inline w-5 h-5 mr-2" />
                      Connexion
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      openCart();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Panier ({itemCount})
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      {/* Cart Panel */}
      <CartPanel isOpen={isOpen} onClose={closeCart} />
    </>
  );
};

export default Navbar;