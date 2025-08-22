import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Grid, List, Sparkles, TrendingUp } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Notification from '../components/Notification';
import { products, categories } from '../data/products';
import { Product } from '../types';

const ITEMS_PER_PAGE = 12;

const Catalogue: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showNew, setShowNew] = useState(false);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'newest' | 'popularity'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const brands = useMemo(() => {
    const uniqueBrands = [...new Set(products.map(p => p.brand))];
    return uniqueBrands.sort();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      const matchesBrand = !selectedBrand || product.brand === selectedBrand;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesNew = !showNew || product.isNew;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesNew;
    });

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case 'popularity':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, showNew, sortBy]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, showNew, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange([0, 2000]);
    setShowNew(false);
    setSortBy('popularity');
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={3000}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-purple-600 bg-clip-text text-transparent mb-4">
            Notre Catalogue
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez {products.length} produits soigneusement sélectionnés pour vous
          </p>
          <div className="flex items-center justify-center mt-4 space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              <span>Produits populaires</span>
            </div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center text-sm text-gray-600">
              <Sparkles className="w-4 h-4 mr-1 text-yellow-500" />
              <span>Nouveautés</span>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-primary" />
                  Filtres
                </h3>
                <button
                  onClick={clearFilters}
                  className="text-sm bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:from-secondary hover:to-primary transition-all duration-300 font-medium"
                >
                  Effacer tout
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rechercher
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Nom, marque, catégorie..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marque
                </label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="">Toutes les marques</option>
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix: €{priceRange[0]} - €{priceRange[1]}
                </label>
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full h-2 bg-gradient-to-r from-primary to-secondary rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gradient-to-r from-secondary to-purple-600 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>
              </div>

              {/* New Products Toggle */}
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={showNew}
                      onChange={(e) => setShowNew(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-6 rounded-full transition-colors duration-300 ${
                      showNew ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gray-300'
                    }`}>
                      <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform duration-300 ${
                        showNew ? 'translate-x-4' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">Nouveautés uniquement</span>
                </label>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/20 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:from-secondary hover:to-primary transition-all duration-300 shadow-lg"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </button>
                
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  <option value="popularity">Popularité</option>
                  <option value="price-asc">Prix croissant</option>
                  <option value="price-desc">Prix décroissant</option>
                  <option value="newest">Nouveautés</option>
                </select>

                {/* View Mode */}
                <div className="hidden sm:flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <motion.div
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {paginatedProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      index={index}
                      onAddToCart={(productName) => {
                        showNotification(`${productName} ajouté au panier !`, 'success');
                      }}
                    />
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center mt-12 space-x-2"
                  >
                    {[...Array(totalPages)].map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                          currentPage === index + 1
                            ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                            : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white border border-white/20 hover:shadow-lg'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  Aucun produit trouvé
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Essayez de modifier vos critères de recherche pour découvrir plus de produits
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl hover:from-secondary hover:to-primary transition-all duration-300 shadow-lg font-medium"
                >
                  Effacer les filtres
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1A2A80, #3B38A0);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1A2A80, #3B38A0);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default Catalogue;