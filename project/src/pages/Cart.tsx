import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import ProductImage from '../components/ProductImage';

const Cart: React.FC = () => {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart, createOrderFromCurrentCart } = useCart();

  // Organize items by category
  const organizedItems = items.reduce((acc, item) => {
    const category = item.product.category || 'Autres';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    try {
      await createOrderFromCurrentCart();
      alert('Commande créée avec succès.');
    } catch (e) {
      alert("Échec de la commande. Connectez-vous et réessayez.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Votre panier est vide
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Découvrez notre catalogue et ajoutez des produits à votre panier
            </p>
            <Link
              to="/catalogue"
              className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-colors"
            >
              Commencer mes achats
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Mon Panier
          </h1>
          <p className="text-lg text-gray-600">
            {itemCount} article{itemCount > 1 ? 's' : ''} dans votre panier
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Articles</h3>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Vider le panier
              </button>
            </div>

            {Object.entries(organizedItems).map(([category, categoryItems], categoryIndex) => (
              <div key={category} className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                  {category}
                  <span className="ml-2 text-sm text-gray-500">({categoryItems.length} article{categoryItems.length > 1 ? 's' : ''})</span>
                </h4>
                
                <div className="space-y-4">
                  {categoryItems.map((item, index) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (categoryIndex * 0.1) + (index * 0.05) }}
                      className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-primary"
                    >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/produit/${item.product.id}`}
                    className="flex-shrink-0"
                  >
                    <ProductImage
                      productId={item.product.id}
                      productName={item.product.name}
                      images={item.product.images}
                      size="medium"
                      showGallery={true}
                      category={item.product.category}
                    />
                  </Link>

                  <div className="flex-1 space-y-2">
                    <Link
                      to={`/produit/${item.product.id}`}
                      className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-gray-600">{item.product.brand}</p>
                    <span className="inline-block px-2 py-1 bg-accent bg-opacity-20 text-accent text-xs rounded-full">
                      {item.product.category}
                    </span>
                    <p className="text-lg font-bold text-primary">€{item.product.price}</p>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-600 hover:text-red-800 p-2 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Prix unitaire: €{item.product.price}
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    Total: €{(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-xl shadow-md sticky top-24"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                Résumé de la commande
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-green-600">Gratuite</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">TVA (20%)</span>
                  <span className="font-medium">€{(total * 0.2).toFixed(2)}</span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-primary">
                      €{(total * 1.2).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCheckout}
                className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-secondary transition-colors flex items-center justify-center space-x-2"
              >
                <span>Procéder au paiement</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <Link
                to="/catalogue"
                className="block text-center text-primary hover:text-secondary mt-4 font-medium"
              >
                Continuer mes achats
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">
                  Paiement sécurisé
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    SSL Sécurisé
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Cryptage
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                    Protection
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    Garantie
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;