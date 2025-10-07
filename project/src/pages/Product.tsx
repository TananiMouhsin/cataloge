import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Minus, Plus, Package, Share2, Heart, Sparkles, Truck, Shield, CheckCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductImage from '../components/ProductImage';
import Notification from '../components/Notification';
import { Product as ProductType } from '../types';
import { useCart } from '../contexts/CartContext';
import { fetchProducts, ApiProduct } from '../lib/api';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  // Tabs and QR code removed for a simpler interface
  const [relatedProducts, setRelatedProducts] = useState<ProductType[]>([]);
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const list = await fetchProducts();
        setAllProducts(list);
        const productId = parseInt(id || '0');
        const found = list.find(p => p.id_produit === productId);
        if (found) {
          // Use real image when valid; otherwise explicit placeholder
          const productImages = (found.qr_code_path && !found.qr_code_path.startsWith('blob:'))
            ? [found.qr_code_path]
            : ['/default-product.svg'];

          const mapped: ProductType = {
            id: found.id_produit,
            name: found.nom,
            description: found.description || '',
            price: found.prix,
            images: productImages,
            category: found.categorie?.nom || 'N/A',
            brand: found.marque?.nom || 'N/A',
            rating: 4.5,
            isNew: false,
            stock: found.stock,
            specifications: {},
            reviews: [],
          };
          setProduct(mapped);

          // Related products: same category, different product
          const related = list
            .filter(p => p.categorie?.nom === found.categorie?.nom && p.id_produit !== found.id_produit)
            .slice(0, 4)
            .map(p => {
              // Use real image when valid; otherwise explicit placeholder
              const relatedImages = (p.qr_code_path && !p.qr_code_path.startsWith('blob:'))
                ? [p.qr_code_path]
                : ['/default-product.svg'];

              return {
                id: p.id_produit,
                name: p.nom,
                description: p.description || '',
                price: p.prix,
                images: relatedImages,
                category: p.categorie?.nom || 'N/A',
                brand: p.marque?.nom || 'N/A',
                rating: 4.2,
                isNew: false,
                stock: p.stock,
                specifications: {},
                reviews: [],
              };
            });
          setRelatedProducts(related);

          // QR code generation removed
        } else {
          setProduct(null);
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({
      message,
      type,
      isVisible: true,
    });
  };

  const [notification, setNotification] = useState({
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
    isVisible: false,
  });

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Chargement du produit...</h2>
          <p className="text-gray-600">Veuillez patienter</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-12 rounded-2xl shadow-lg max-w-md mx-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Produit non trouvé</h2>
          <Link to="/catalogue" className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au catalogue
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    showNotification(`${product.name} ajouté au panier !`, 'success');
    openCart();
  };

  const handleBuyNow = () => {
    // Add one item and take user to cart panel for checkout
    addItem(product);
    showNotification(`Achat rapide pour ${product.name}`, 'success');
    openCart();
  };

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        duration={3000}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/catalogue"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au catalogue
          </Link>
        </motion.div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <ProductImage
                productId={product.id}
                productName={product.name}
                images={product.images}
                size="large"
                showGallery={false}
                className="w-full h-full scale-[1.01] hover:scale-105 transition-transform duration-300"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-blue-600 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <ProductImage
                      productId={product.id}
                      productName={`${product.name} ${index + 1}`}
                      images={[image]}
                      size="large"
                      showGallery={false}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 lg:sticky lg:top-24 self-start"
          >
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                  {product.brand}
                </span>
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors duration-200">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">{product.name}</h1>
              <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {product.rating}
                </span>
              </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                  {product.category}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                  {product.brand}
                </span>
              </div>
            </div>

            {/* Price and stock */}
            <div className="space-y-4 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-gray-900">€{product.price}</span>
                {product.isNew && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Nouveau
                  </span>
                )}
              </div>
              <div>
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-lg ${
                  product.stock > 10 ? 'bg-green-50 text-green-700' :
                  product.stock > 0 ? 'bg-orange-50 text-orange-700' :
                  'bg-red-50 text-red-700'
                }`}>
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">
                    {product.stock > 0 ? `${product.stock} en stock` : 'Rupture de stock'}
                  </span>
                </div>
                {/* Stock progress */}
                {product.stock > 0 && (
                  <div className="mt-3">
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, Math.round((product.stock / 20) * 100))}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Disponibilité du stock</p>
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Quantité</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                  <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-3 font-medium text-lg min-w-[60px] text-center">{quantity}</span>
                  <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock} className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}</span>
              </motion.button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="w-full border border-blue-600 text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-200 disabled:border-gray-300 disabled:text-gray-400"
              >
                Acheter maintenant
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Truck className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Livraison rapide</p>
                  <p className="text-xs text-gray-600">24-72h selon destination</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 border border-gray-200">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Paiement sécurisé</p>
                  <p className="text-xs text-gray-600">Protection acheteur</p>
                </div>
              </div>
            </div>

            {/* QR Code section removed */}
          </motion.div>
        </div>

        {/* Product Details - simplified description card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 rounded-2xl shadow-sm mb-16 overflow-hidden"
        >
          <div className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
            <p className="text-gray-600 leading-relaxed text-lg">{product.description}</p>
          </div>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Produits similaires</h2>
              <p className="text-gray-600 text-lg">Découvrez d'autres produits de la même catégorie</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} index={index} onAddToCart={(productName) => { showNotification(`${productName} ajouté au panier !`, 'success'); }} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Product;