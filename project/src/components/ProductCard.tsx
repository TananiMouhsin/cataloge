import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import ProductImage from './ProductImage';

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart?: (productName: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, index = 0, onAddToCart }) => {
  const { addItem, openCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart(); // Open cart panel after adding item
    
    // Call the callback if provided
    if (onAddToCart) {
      onAddToCart(product.name);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-105 h-96 flex flex-col"
    >
      <Link to={`/produit/${product.id}`}>
        <div className="relative overflow-hidden h-64">
          <ProductImage
            productId={product.id}
            productName={product.name}
            images={product.images}
            size="large"
            showGallery={true}
            category={product.category}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 space-y-2">
            {product.isNew && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-green-400 to-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Nouveau
              </motion.div>
            )}
            {product.originalPrice && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-red-400 to-red-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg"
              >
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </motion.div>
            )}
          </div>

          {/* Stock Badge */}
          <div className="absolute top-3 right-3">
            <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center shadow-lg backdrop-blur-sm ${
              product.stock > 10 ? 'bg-green-100/90 text-green-800 border border-green-200' :
              product.stock > 0 ? 'bg-orange-100/90 text-orange-800 border border-orange-200' :
              'bg-red-100/90 text-red-800 border border-red-200'
            }`}>
              <Package className="w-3 h-3 mr-1" />
              {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
            </div>
          </div>

          {/* Add to Cart Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="absolute bottom-3 right-3 bg-gradient-to-r from-primary to-secondary text-white p-3 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-500 disabled:bg-gray-400 disabled:cursor-not-allowed hover:shadow-2xl"
          >
            <ShoppingCart className="w-4 h-4" />
          </motion.button>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          {/* Shine effect */}
          <div className="pointer-events-none absolute inset-0 -skew-x-12 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
            <div className="absolute top-0 left-[-50%] h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent translate-x-[-100%] group-hover:translate-x-[250%] transition-transform duration-700" />
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-all duration-300 text-lg">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1 font-medium">{product.brand}</p>
              <span className="inline-block mt-1 px-2 py-1 bg-gradient-to-r from-accent to-purple-600 text-white text-xs rounded-full font-medium">
                {product.category}
              </span>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2 font-medium">({product.rating})</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                €{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  €{product.originalPrice}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Accent bar on hover */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-secondary group-hover:w-full transition-all duration-500" />
    </motion.div>
  );
};

export default ProductCard;