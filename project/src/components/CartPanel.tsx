import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartPanel: React.FC<CartPanelProps> = ({ isOpen, onClose }) => {
  const { items, total, itemCount, removeItem, updateQuantity } = useCart();

  const handleQuantityChange = (productId: number, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeItem(productId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />
          
          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Panier</h2>
                {itemCount > 0 && (
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Votre panier est vide</h3>
                  <p className="text-gray-500">Ajoutez des produits pour commencer vos achats</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex space-x-4 p-4 bg-gray-50 rounded-lg">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-500">{item.product.brand}</p>
                        <p className="text-sm font-semibold text-gray-900">€{item.product.price}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end space-y-2">
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity, -1)}
                            className="p-1 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 py-1 text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.product.id, item.quantity, 1)}
                            className="p-1 hover:bg-gray-100 transition-colors duration-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveItem(item.product.id)}
                          className="p-1 text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">€{total.toFixed(2)}</span>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/panier"
                    onClick={onClose}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <span>Voir le panier complet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
                  >
                    Continuer les achats
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartPanel;
