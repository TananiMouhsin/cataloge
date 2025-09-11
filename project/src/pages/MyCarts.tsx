import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plus, Trash2, ShoppingBag, Calendar, Package, ArrowRight, User, DollarSign, Clock, Edit3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

interface CartData {
  id_panier: number;
  id_users: number;
  items: Array<{
    id_produit: number;
    quantite: number;
    date_mise_a_jour?: string;
  }>;
  date_creation?: string;
}

const MyCarts: React.FC = () => {
  const { user } = useAuth();
  const { allCarts, currentCartId, switchToCart, createNewCart, deleteCart, loadAllCarts } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'items' | 'value'>('date');
  const [filterEmpty, setFilterEmpty] = useState(false);

  useEffect(() => {
    loadCarts();
  }, []);

  const loadCarts = async () => {
    try {
      setLoading(true);
      setError(null);
      await loadAllCarts();
    } catch (e) {
      setError('Impossible de charger vos paniers');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCart = async () => {
    try {
      await createNewCart();
    } catch (e) {
      setError('Impossible de créer un nouveau panier');
    }
  };

  const handleDeleteCart = async (cartId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce panier ?')) {
      try {
        await deleteCart(cartId);
      } catch (e) {
        setError('Impossible de supprimer le panier');
      }
    }
  };

  const handleSwitchToCart = async (cartId: number) => {
    try {
      await switchToCart(cartId);
    } catch (e) {
      setError('Impossible de changer de panier');
    }
  };

  const getTotalItems = (cart: CartData) => {
    return cart.items.reduce((sum, item) => sum + item.quantite, 0);
  };

  const getTotalValue = (cart: CartData) => {
    // Note: This is a simplified calculation since we don't have product prices in the cart data
    // In a real app, you'd fetch product details to calculate the actual total
    return cart.items.length * 10; // Placeholder calculation
  };

  const getFilteredAndSortedCarts = () => {
    let filteredCarts = allCarts;
    
    if (filterEmpty) {
      filteredCarts = allCarts.filter(cart => cart.items.length > 0);
    }
    
    return filteredCarts.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.date_creation || 0).getTime() - new Date(a.date_creation || 0).getTime();
        case 'items':
          return getTotalItems(b) - getTotalItems(a);
        case 'value':
          return getTotalValue(b) - getTotalValue(a);
        default:
          return 0;
      }
    });
  };

  const sortedCarts = getFilteredAndSortedCarts();
  const totalCarts = allCarts.length;
  const totalItems = allCarts.reduce((sum, cart) => sum + getTotalItems(cart), 0);
  const totalValue = allCarts.reduce((sum, cart) => sum + getTotalValue(cart), 0);
  const emptyCarts = allCarts.filter(cart => cart.items.length === 0).length;

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Connexion requise
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Vous devez être connecté pour voir vos paniers
            </p>
            <Link
              to="/login"
              className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-colors"
            >
              Se connecter
            </Link>
          </div>
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
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Mes Paniers
              </h1>
              <p className="text-lg text-gray-600">
                Gérez tous vos paniers de produits
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateCart}
              className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-secondary transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Nouveau panier</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-blue-500">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Paniers</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCarts}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-green-500">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Articles</p>
                <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-purple-500">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-semibold text-gray-900">€{totalValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-l-orange-500">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Paniers Vides</p>
                <p className="text-2xl font-semibold text-gray-900">{emptyCarts}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Sorting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl shadow-md mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'items' | 'value')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="date">Date de création</option>
                <option value="items">Nombre d'articles</option>
                <option value="value">Valeur</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={filterEmpty}
                  onChange={(e) => setFilterEmpty(e.target.checked)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-700">Masquer les paniers vides</span>
              </label>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Chargement de vos paniers...</p>
          </div>
        ) : carts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Aucun panier trouvé
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Créez votre premier panier pour commencer vos achats
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreateCart}
              className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-secondary transition-colors flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Créer un panier</span>
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCarts.map((cart, index) => (
              <motion.div
                key={cart.id_panier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Panier #{cart.id_panier}
                      </h3>
                      {cart.items.length === 0 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          Vide
                        </span>
                      )}
                    </div>
                    {cart.date_creation && (
                      <p className="text-sm text-gray-600 flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(cart.date_creation).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleDeleteCart(cart.id_panier)}
                      className="text-red-600 hover:text-red-800 p-2 transition-colors"
                      title="Supprimer le panier"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-gray-600">
                      <Package className="w-4 h-4 mr-2" />
                      <span className="text-sm">
                        {getTotalItems(cart)} article{getTotalItems(cart) > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">
                        €{getTotalValue(cart).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  
                  {cart.items.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Produits :</p>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {cart.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-600 flex justify-between">
                            <span>Produit #{item.id_produit}</span>
                            <span className="font-medium">x{item.quantite}</span>
                          </div>
                        ))}
                        {cart.items.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{cart.items.length - 3} autre{cart.items.length - 3 > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Package className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500 italic">Panier vide</p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSwitchToCart(cart.id_panier)}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-1 ${
                      currentCartId === cart.id_panier
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{currentCartId === cart.id_panier ? 'Panier actuel' : 'Utiliser ce panier'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {cart.items.length > 0 && (
                    <button
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-1"
                      title="Modifier le panier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCarts;
