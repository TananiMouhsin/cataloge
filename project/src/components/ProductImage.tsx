import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductImageProps {
  productId: number;
  productName: string;
  images?: string[];
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showGallery?: boolean;
  category?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ 
  productId, 
  productName, 
  images = [], 
  className = '',
  size = 'medium',
  showGallery = false,
  category = ''
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-full h-full'
  };

  // Use real images or provide default fallback
  const getProductImages = () => {
    // Filter out invalid blob URLs persisted from previous sessions
    const valid = (images || []).filter((u) => !!u && !String(u).startsWith('blob:'));
    if (valid.length > 0) {
      // If it's a filename (not a full URL), prepend the uploads path
      return valid.map(img => {
        if (img.startsWith('http') || img.startsWith('/')) {
          return img;
        }
        return `http://localhost:8000/uploads/images/${img}`;
      });
    }
    // Only use default image if no real image is provided
    return ['/default-product.svg'];
  };

  const productImages = getProductImages();
  const currentImage = productImages[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  if (showGallery && productImages.length > 1) {
    return (
      <div className={`relative group`}>
        {/* Image */}
        <img
          src={currentImage}
          alt={productName}
          className={`${sizeClasses[size]} object-cover rounded-lg transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          onLoad={() => setIsLoaded(true)}
          onError={(e) => {
            e.currentTarget.src = '/default-product.svg';
            setIsLoaded(true);
          }}
        />

        {/* Shimmer placeholder while loading */}
        {!isLoaded && (
          <div className={`${sizeClasses[size]} absolute inset-0 rounded-lg overflow-hidden`}>
            <div className="w-full h-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
          </div>
        )}
        
        {/* Navigation arrows */}
        <button
          onClick={prevImage}
          className="absolute left-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        
        <button
          onClick={nextImage}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRight className="w-3 h-3" />
        </button>
        
        {/* Image indicators */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {productImages.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative`}>
      {/* Main image with fade-in */}
      <img
        src={currentImage}
        alt={productName}
        className={`${sizeClasses[size]} object-cover rounded-lg transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          e.currentTarget.src = '/default-product.svg';
          setIsLoaded(true);
        }}
      />

      {/* Shimmer placeholder while loading */}
      {!isLoaded && (
        <div className={`${sizeClasses[size]} absolute inset-0 rounded-lg overflow-hidden`}>
          <div className="w-full h-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
        </div>
      )}
      
      {/* Category badge */}
      {category && (
        <div className="absolute -top-1 -right-1 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full shadow-sm">
          {category.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default ProductImage;
