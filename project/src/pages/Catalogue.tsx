import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, SortAsc, SortDesc, Grid, List, Sparkles, TrendingUp, Loader2 } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Notification from '../components/Notification';
import ProductImage from '../components/ProductImage';
import { fetchProducts, fetchCategories, fetchBrands, ApiProduct, ApiCategory, ApiBrand } from '../lib/api';
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
  const [organizationMode, setOrganizationMode] = useState<'normal' | 'category'>('normal');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [productsData, categoriesData, brandsData] = await Promise.all([
          fetchProducts(),
          fetchCategories(),
          fetchBrands()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
      } catch (error) {
        console.error('Error loading data:', error);
        showNotification('Erreur lors du chargement des données', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const catName = product.categorie?.nom || '';
      const brandName = product.marque?.nom || '';
      const matchesSearch = product.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           catName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || catName === selectedCategory;
      const matchesBrand = !selectedBrand || brandName === selectedBrand;
      const matchesPrice = product.prix >= priceRange[0] && product.prix <= priceRange[1];
      const matchesNew = !showNew;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesNew;
    });

    // Sort products
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.prix - b.prix);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.prix - a.prix);
        break;
      case 'newest':
        // Sort by id_produit (assumed numeric) newest first
        filtered.sort((a, b) => (b.id_produit as unknown as number) - (a.id_produit as unknown as number));
        break;
      case 'popularity':
        filtered.sort((a, b) => b.stock - a.stock);
        break;
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, showNew, sortBy, products, categories, brands]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  // Organize products by category for better visual organization
  const organizedProductsByCategory = useMemo(() => {
    const organized = filteredProducts.reduce((acc, product) => {
      const category = product.categorie?.nom || 'Autres';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {} as Record<string, ApiProduct[]>);

    return organized;
  }, [filteredProducts]);

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
            Découvrez {isLoading ? '...' : products.length} produits soigneusement sélectionnés pour vous
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
                    <option key={category.id_categorie} value={category.nom}>
                      {category.nom}
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
                    <option key={brand.id_marque} value={brand.nom}>
                      {brand.nom}
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

                {/* Organization Mode */}
                <div className="hidden sm:flex bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setOrganizationMode('normal')}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                      organizationMode === 'normal' 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => setOrganizationMode('category')}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 text-sm font-medium ${
                      organizationMode === 'category' 
                        ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg' 
                        : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    Par catégorie
                  </button>
                </div>

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
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                  <p className="text-gray-600">Chargement des produits...</p>
                </div>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                {organizationMode === 'normal' ? (
                <motion.div
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  }`}
                >
                    {paginatedProducts.map((product, index) => {
                    // Use real product images or empty array for fallback
                    const productImages = product.qr_code_path ? [product.qr_code_path] : [];

                    // Convert API product to frontend Product format
                    const frontendProduct: Product = {
                      id: product.id_produit,
                      name: product.nom,
                      description: product.description || '',
                      price: product.prix,
                      images: productImages,
                      category: product.categorie?.nom || 'Inconnu',
                      brand: product.marque?.nom || 'Inconnu',
                      rating: 4.5,
                      isNew: false,
                      stock: product.stock,
                      specifications: {},
                      reviews: []
                    };

                    return (
                      <ProductCard 
                        key={product.id_produit} 
                        product={frontendProduct} 
                        index={index}
                        onAddToCart={(productName) => {
                          showNotification(`${productName} ajouté au panier !`, 'success');
                        }}
                      />
                    );
                    })}
                  </motion.div>
                ) : (
                  <div className="space-y-12">
                    {Object.entries(organizedProductsByCategory).map(([category, categoryProducts], categoryIndex) => (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: categoryIndex * 0.1 }}
                        className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20"
                      >
                        <div className="flex items-center justify-between mb-8">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-gradient-to-r from-primary to-secondary rounded-full mr-3"></div>
                            <h3 className="text-2xl font-bold text-gray-800">{category}</h3>
                            <span className="ml-3 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {categoryProducts.length} produit{categoryProducts.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        
                        <div className={`grid gap-6 ${
                          viewMode === 'grid' 
                            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'grid-cols-1'
                        }`}>
                          {categoryProducts.map((product, index) => {
                            // Use real product images or empty array for fallback
                            const productImages = product.qr_code_path ? [product.qr_code_path] : [];

                            // Convert API product to frontend Product format
                            const frontendProduct: Product = {
                              id: product.id_produit,
                              name: product.nom,
                              description: product.description || '',
                              price: product.prix,
                              images: productImages,
                              category: product.categorie?.nom || 'Inconnu',
                              brand: product.marque?.nom || 'Inconnu',
                              rating: 4.5,
                              isNew: false,
                              stock: product.stock,
                              specifications: {},
                              reviews: []
                            };

                            return (
                              <ProductCard 
                                key={product.id_produit} 
                                product={frontendProduct} 
                                index={index}
                                onAddToCart={(productName) => {
                                  showNotification(`${productName} ajouté au panier !`, 'success');
                                }}
                              />
                            );
                          })}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

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